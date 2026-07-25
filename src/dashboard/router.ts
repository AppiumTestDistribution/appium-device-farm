import axios from 'axios';
import { NextFunction, Request, Response, Router } from 'express';
import fs from 'fs';
import _ from 'lodash';
import multer from 'multer';
import os from 'os';
import path from 'path';
import formdata from 'form-data';
import {
  adminOnly,
  AuthenticatedRequest,
  authMiddleware,
} from '../auth/middleware/auth.middleware';
import { config } from '../config';
import { ATDRepository } from '../data-service/db';
import {
  generateDeviceId,
  getDevice,
  updateDeviceDetails,
  updateDeviceName,
} from '../data-service/device-service';
import { NodeService } from '../data-service/node-service';
import { IDevice } from '../interfaces/IDevice';
import { IPluginArgs } from '../interfaces/IPluginArgs';
import log from '../logger';
import { DevicePlugin } from '../plugin';
import { prisma } from '../prisma';
import { nodeUrl } from '../helpers';
import getWDABundleID from '../app-utils/extractBundleId';
import { deviceManagementController } from './controllers/device-management-controller';
import { getIosDeviceLogs } from './controllers/ios/device-control';
import { SESSION_MANAGER } from './sessions/SessionManager';

interface ErrorResponse {
  error: true;
  message: string;
}
const uploadDir = path.join(os.homedir(), '.cache', 'appium-device-farm', 'assets');

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    if (file.originalname === 'wda-resign.ipa') {
      cb(null, file.originalname);
    } else {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  },
});

const upload = multer({ storage: storage });

async function isValidSession(request: Request, response: Response, next: NextFunction) {
  const sessionId = request.params.sessionId;
  const session =
    SESSION_MANAGER.getSession(sessionId) ||
    (await prisma.session.findUnique({ where: { id: sessionId } }));
  if (!session) {
    const errorResponse: ErrorResponse = {
      error: true,
      message: `Session with id ${sessionId} not found`,
    };
    return response.status(404).json(errorResponse);
  }
  next();
}

async function getSessions(request: Request, response: Response) {
  const { buildId } = request.query;
  const sessions = await prisma.session.findMany({
    orderBy: { createdAt: 'desc' },
    where: { buildId: buildId as string },
  });
  response.json(sessions);
}

async function getBuilds(request: Request, response: Response) {
  const builds = await prisma.build.findMany({ orderBy: { createdAt: 'desc' } });
  response.json(builds);
}

async function cleanupBuilds(request: Request, response: Response) {
  try {
    const { retentionDays } = request.body;

    if (!retentionDays || typeof retentionDays !== 'number' || retentionDays < 0) {
      return response.status(400).json({ error: 'Invalid retentionDays parameter' });
    }

    const now = new Date();
    const retentionDate = new Date(now);
    retentionDate.setDate(retentionDate.getDate() - retentionDays);
    retentionDate.setHours(0, 0, 0, 0);

    log.info(
      `Cleanup requested: retaining builds for ${retentionDays} days (cutoff date: ${retentionDate.toISOString()}, timestamp: ${retentionDate.getTime()})`,
    );

    const allBuilds = await prisma.build.findMany({
      select: { id: true, name: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    log.info(`Total builds in database: ${allBuilds.length}`);
    if (allBuilds.length > 0) {
      log.info(
        `Sample build dates: ${allBuilds
          .slice(0, 5)
          .map((b) => `${b.id}: ${b.createdAt.toISOString()} (${new Date(b.createdAt).getTime()})`)
          .join(', ')}`,
      );
    }

    const buildsToDelete = await prisma.build.findMany({
      where: {
        createdAt: {
          lt: retentionDate,
        },
      },
      select: { id: true, name: true, createdAt: true },
    });

    log.info(`Found ${buildsToDelete.length} builds to delete`);

    if (buildsToDelete.length === 0 && allBuilds.length > 0) {
      const oldestBuild = allBuilds[0];
      const buildAgeInDays = Math.floor(
        (new Date().getTime() - new Date(oldestBuild.createdAt).getTime()) / (1000 * 60 * 60 * 24),
      );
      log.info(
        `No builds to delete. Oldest build is ${buildAgeInDays} days old (cutoff: ${retentionDays} days). Build dates: ${allBuilds.map((b) => `${b.createdAt.toISOString()}`).join(', ')}`,
      );
    }

    if (buildsToDelete.length > 0) {
      log.info(
        `Builds to delete: ${buildsToDelete.map((b) => `${b.id} (created: ${b.createdAt.toISOString()})`).join(', ')}`,
      );
    }

    const buildIdsToDelete = buildsToDelete.map((b) => b.id);

    if (buildIdsToDelete.length === 0) {
      const message =
        allBuilds.length > 0
          ? `No builds older than ${retentionDays} days found. All ${allBuilds.length} build(s) are within the retention period.`
          : 'No builds found in database.';
      return response.json({
        message,
        deletedBuilds: 0,
        deletedSessions: 0,
        deletedSessionLogs: 0,
        deletedTestEventJournals: 0,
      });
    }

    const sessionsToDelete = await prisma.session.findMany({
      where: { buildId: { in: buildIdsToDelete } },
      select: { id: true },
    });
    const sessionIdsToDelete = sessionsToDelete.map((s) => s.id);
    log.info(`Found ${sessionIdsToDelete.length} sessions to delete`);

    let deletedSessionLogs = { count: 0 };
    let deletedTestEventJournals = { count: 0 };
    let deletedSessions = { count: 0 };
    let deletedBuilds = { count: 0 };

    if (sessionIdsToDelete.length > 0) {
      try {
        deletedSessionLogs = await prisma.sessionLog.deleteMany({
          where: { sessionId: { in: sessionIdsToDelete } },
        });
        log.info(`Deleted ${deletedSessionLogs.count} session logs`);
      } catch (error) {
        log.error(`Error deleting session logs: ${error}`);
        throw new Error(
          `Failed to delete session logs: ${error instanceof Error ? error.message : String(error)}`,
        );
      }

      try {
        deletedTestEventJournals = await prisma.testEventJournal.deleteMany({
          where: { session_id: { in: sessionIdsToDelete } },
        });
        log.info(`Deleted ${deletedTestEventJournals.count} test event journals`);
      } catch (error) {
        log.error(`Error deleting test event journals: ${error}`);
        throw new Error(
          `Failed to delete test event journals: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    } else {
      log.info('No sessions to delete, skipping session logs and test event journals');
    }

    try {
      deletedSessions = await prisma.session.deleteMany({
        where: { buildId: { in: buildIdsToDelete } },
      });
      log.info(`Deleted ${deletedSessions.count} sessions`);
    } catch (error) {
      log.error(`Error deleting sessions: ${error}`);
      throw new Error(
        `Failed to delete sessions: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    try {
      deletedBuilds = await prisma.build.deleteMany({
        where: { id: { in: buildIdsToDelete } },
      });
      log.info(`Deleted ${deletedBuilds.count} builds`);
    } catch (error) {
      log.error(`Error deleting builds: ${error}`);
      throw new Error(
        `Failed to delete builds: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    const result = {
      deletedBuilds: deletedBuilds.count,
      deletedSessions: deletedSessions.count,
      deletedSessionLogs: deletedSessionLogs.count,
      deletedTestEventJournals: deletedTestEventJournals.count,
    };

    if (sessionIdsToDelete.length > 0) {
      let removedDirs = 0;
      for (const sessionId of sessionIdsToDelete) {
        const sessionDir = path.join(config.sessionAssetsPath, sessionId);
        try {
          if (fs.existsSync(sessionDir)) {
            fs.rmSync(sessionDir, { recursive: true, force: true });
            removedDirs++;
          }
        } catch (err) {
          log.warn(`Failed to remove session assets at ${sessionDir}: ${err}`);
        }
      }
      log.info(
        `Removed ${removedDirs} session asset director${removedDirs === 1 ? 'y' : 'ies'} from cache`,
      );
    }

    log.info(`Cleanup completed successfully: ${JSON.stringify(result)}`);
    response.json({ message: 'Cleanup completed', ...result });
  } catch (error) {
    log.error('Error during cleanup:', error);
    if (!response.headersSent) {
      response.status(500).json({
        error: 'Cleanup failed',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

async function getAppsInformation(request: Request, response: Response) {
  const apps = await prisma.appInformation.findMany({ orderBy: { createdAt: 'desc' } });
  response.json(apps);
}

async function deleteUploadedApp(request: Request, response: Response) {
  const fileName = request.body.id;
  const filteredFile = await prisma.appInformation.findFirst({
    where: {
      uploadedFileName: fileName,
    },
  });
  const app = await prisma.appInformation.delete({
    where: { id: filteredFile?.id },
  });
  const fileToDelete = path.join(os.homedir(), '.cache', 'appium-device-farm', 'assets', fileName);
  fs.unlinkSync(fileToDelete);
  response.json(app);
}

async function getSessionLogs(request: Request, response: Response) {
  const { sessionId } = request.params;
  const logs = await prisma.sessionLog.findMany({
    orderBy: { createdAt: 'desc' },
    where: { sessionId: sessionId },
  });
  response.json(logs);
}

async function getDeviceLogs(request: Request, response: Response) {
  const { sessionId } = request.params;
  const session = SESSION_MANAGER.getSession(sessionId);
  let deviceLogs: any[] | null = [];

  if (session) {
    deviceLogs = await session?.getDeviceLogs(true);
  } else {
    const existingSession = await prisma.session.findFirst({
      where: { id: sessionId as string },
    });
    if (
      existingSession &&
      existingSession.deviceLogs &&
      fs.existsSync(path.join(config.sessionAssetsPath, existingSession.deviceLogs))
    ) {
      const logPath = path.join(config.sessionAssetsPath, existingSession.deviceLogs);
      deviceLogs = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
    }
  }

  if (!deviceLogs) {
    const errorResponse: ErrorResponse = {
      error: true,
      message: 'Device logs not available',
    };
    return response.status(500).json(errorResponse);
  }

  return response.status(200).send({
    logs: deviceLogs,
  });
}

async function startAppProfiling(request: Request, response: Response) {
  const { sessionId } = request.params;
  const session = SESSION_MANAGER.getSession(sessionId);

  if (session) {
    const hasAppProfiling = await session?.startAppProfiling();
    return response.status(200).send({
      success: hasAppProfiling,
    });
  }

  return response.status(500).send({
    success: false,
  });
}

async function stopAppProfiling(request: Request, response: Response) {
  const { sessionId } = request.params;
  const session = SESSION_MANAGER.getSession(sessionId);
  let profiling: any;

  if (session) {
    profiling = await session?.stopAppProfiling();
  } else {
    const existingSession = await prisma.session.findFirst({
      where: { id: sessionId as string },
    });
    if (
      existingSession &&
      existingSession.appProfiling &&
      fs.existsSync(path.join(config.sessionAssetsPath, existingSession.appProfiling))
    ) {
      const logPath = path.join(config.sessionAssetsPath, existingSession.appProfiling);
      profiling = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
    }
  }

  if (!profiling) {
    const errorResponse: ErrorResponse = {
      error: true,
      message: 'App profiling not available',
    };
    return response.status(500).json(errorResponse);
  }

  return response.status(200).send(profiling);
}

async function addDeviceTags(req: Request, res: Response) {
  const { host, udid, tags } = req.body;
  const device = await getDevice({
    filterByHost: host,
    udid: [udid],
  });

  if (device) {
    await prisma.device.update({
      where: {
        id: generateDeviceId(device),
      },
      data: {
        tags: tags.length > 0 ? tags.join(',') : '',
      },
    });

    await updateDeviceDetails();
  }

  return res.status(200).send({ message: 'Tags saved successfully' });
}

async function handleDeviceNameUpdate(req: Request, res: Response) {
  const { host, udid, name } = req.body;
  const device = await getDevice({
    filterByHost: host,
    udid: [udid],
  });

  if (device) {
    await updateDeviceName(host, udid, name);
    return res.status(200).send({ message: 'Device name updated successfully' });
  }
  return res.status(404).send({ message: 'Device not found' });
}

async function getServers(request: Request, response: Response) {
  const nodes = await NodeService.getAllNodes();

  return response.status(200).json(nodes);
}

async function getAppiumLogs(request: Request, response: Response) {
  const { nodeId } = request.params;
  if (!nodeId) {
    return response.status(404).send('Nodeid missing in parameter');
  }

  const logFile = DevicePlugin.serverArgs.logFile
    ? path.resolve(DevicePlugin.serverArgs.logFile)
    : null;
  if (nodeId === DevicePlugin.NODE_ID) {
    if (!logFile) {
      return response.status(400).json({
        error: 'Log file is not enabled while starting the server',
      });
    }

    let watcher: fs.FSWatcher | null = null;
    let readStream: fs.ReadStream | null = null;

    const cleanup = () => {
      if (watcher) {
        watcher.close();
        watcher = null;
      }
      if (readStream) {
        readStream?.destroy();
        readStream = null;
      }
      if (!response.writableEnded) {
        response.end();
      }
    };

    try {
      if (!fs.existsSync(logFile)) {
        return response.status(404).json({
          error: 'Log file does not exist',
        });
      }

      response.setHeader('Content-Type', 'text/plain');
      response.setHeader('Cache-Control', 'no-cache');
      response.setHeader('X-Content-Type-Options', 'nosniff');

      let lastSize = 0;
      let errorCount = 0;
      const MAX_ERRORS = 3;

      const sendNewContent = async () => {
        try {
          const stats = await fs.promises.stat(logFile!);

          if (stats.size < lastSize) {
            lastSize = 0;
          }

          if (stats.size > lastSize) {
            readStream = fs.createReadStream(logFile!, {
              start: lastSize,
              end: stats.size,
              highWaterMark: 64 * 1024,
            });

            await new Promise((resolve, reject) => {
              readStream!.on('data', (chunk) => {
                if (!response.writableEnded) {
                  response.write(chunk);
                }
              });

              readStream!.on('end', () => {
                lastSize = stats.size;
                readStream?.destroy();
                resolve(null);
              });

              readStream!.on('error', reject);
            });

            errorCount = 0;
          }
        } catch (err) {
          errorCount++;
          log.error(`Error reading file content: ${err}`);

          if (errorCount >= MAX_ERRORS) {
            log.error('Max error count reached, stopping stream');
            cleanup();
            if (!response.headersSent) {
              response.status(500).send('Error: Log file is no longer accessible');
            }
          }
        }
      };

      await sendNewContent();

      watcher = fs.watch(logFile, async (eventType) => {
        if (eventType === 'change' && !response.writableEnded) {
          await sendNewContent();
        }
      });

      watcher.on('error', (error) => {
        log.error(`Error watching log file: ${error}`);
        cleanup();
        if (!response.headersSent) {
          response.status(500).send('Error watching log file');
        }
      });

      request.on('close', cleanup);
      response.on('error', (error) => {
        log.error(`Response error: ${error}`);
        cleanup();
      });
    } catch (error) {
      log.error(`Error accessing appium logs: ${error}`);
      cleanup();
      if (!response.headersSent) {
        return response.status(500).send('Error accessing appium logs');
      }
    }
  } else {
    const node = await NodeService.getNodeById(nodeId);
    if (node) {
      try {
        const remoteUrl = `${node.host}/device-farm/api/dashboard/server/${nodeId}/appium_logs`;

        const remoteResponse = await axios({
          method: 'get',
          url: remoteUrl,
          responseType: 'stream',
          timeout: 30000,
          headers: {
            Accept: 'text/plain',
            'Cache-Control': 'no-cache',
          },
          maxRedirects: 5,
          validateStatus: (status) => status < 400,
        });

        response.setHeader('Content-Type', 'text/plain');
        response.setHeader('Cache-Control', 'no-cache');
        response.setHeader('X-Content-Type-Options', 'nosniff');
        response.setHeader('Connection', 'keep-alive');

        const stream = remoteResponse.data;
        stream.pipe(response, { end: false });

        stream.on('error', (error: Error) => {
          log.error(`Error streaming remote appium logs: ${error}`);
          if (!response.headersSent) {
            response.status(500).send('Error streaming remote appium logs');
          }
          stream?.destroy();
        });

        stream.on('end', () => {
          log.info('Remote stream ended normally');
          response.end();
        });

        request.on('close', () => {
          stream?.destroy();
          response.end();
        });

        response.on('error', (error) => {
          log.error(`Response error: ${error}`);
          stream?.destroy();
        });
      } catch (error: any) {
        log.error(`Error proxying to remote node: ${error}`);
        if (error.response) {
          return response
            .status(error.response.status)
            .send(`Error fetching logs from remote node: ${error.response.statusText}`);
        }
        return response.status(500).send(`Error fetching logs from remote node: ${error.message}`);
      }
    } else {
      return response.status(404).send(`No node found with id ${nodeId}`);
    }
  }
}

async function authenticateNode(request: Request, response: Response) {
  return response.status(200).send({
    message: 'success',
  });
}

async function registerNode(request: Request, response: Response) {
  try {
    const { id } = request.body;
    const { user } = request as AuthenticatedRequest;
    if (!id) {
      return response.status(400).send({
        message: 'id is required',
      });
    }
    await NodeService.addNode(id, request.body, user?.userId);
    return response.status(200).send({
      message: 'Success',
    });
  } catch (err: any) {
    return response.status(400).send({
      message: err.message,
    });
  }
}

async function uploadAppInformation(request: Request, response: Response) {
  const platform = request.body.file.originalname.endsWith('.apk') ? 'android' : 'ios';
  const filename = request.body.file.filename;
  const size = request.body.file.size;
  const bundleId = request.body.bundleId;
  await prisma.appInformation.create({
    data: {
      fileName: request.body.file.originalname,
      path: `/device-farm/apps/${filename}`,
      uploadedFileName: filename,
      fileSize: size.toString(),
      appBundleId: bundleId,
      platform,
    },
  });
  return response.status(200).send({
    message: 'File information saved successfully',
  });
}

async function uploadFileRemote(filePath: string, device: IDevice) {
  const form = new formdata();
  form.append('file', fs.readFileSync(filePath), path.basename(filePath));
  const response = await axios({
    url: `${nodeUrl(device)}/device-farm/api/dashboard/upload`,
    method: 'post',
    headers: {
      ...form.getHeaders(),
    },
    data: form,
  });
  return response.data.file.path;
}

async function handleFileUpload(req: any, res: Response) {
  console.log('storage location is ', req.hostname + '/' + req.file.path);
  const devices = (await ATDRepository.DeviceModel).chain().find({ platform: 'ios' }).data();
  const uniqByHost = _.uniqBy(devices, 'host');
  const pathToUploadApp = path.join(
    os.homedir(),
    '.cache',
    'appium-device-farm',
    'assets',
    'wda-resign.ipa',
  );
  const asyncCall = async (device: IDevice) => {
    if (device.nodeId !== DevicePlugin.NODE_ID) {
      console.log('Uploading WDA to remote machines');
      await uploadFileRemote(pathToUploadApp, device);
    }
  };
  if (uniqByHost && uniqByHost.length > 0) {
    await Promise.all(uniqByHost.map((device: IDevice) => asyncCall(device)));
  }
  if (req.file) {
    console.log('storage location is ', req.hostname + '/' + req.file.path);
    let bundleId = '';
    if (req.file.originalname === 'wda-resign.ipa') {
      bundleId = await getWDABundleID();
    }
    res
      .status(200)
      .json({ success: true, message: 'File uploaded successfully', file: req.file, bundleId });
  } else {
    res.status(400).json({ success: false, message: 'File upload failed' });
  }
}

// Register routes
function registerRoutes(router: Router, pluginArgs: IPluginArgs) {
  router.use('/session/:sessionId', isValidSession);

  // Device Management Routes (admin)
  router.get(
    '/devices',
    authMiddleware(pluginArgs),
    adminOnly,
    deviceManagementController.listDevices,
  );
  router.get('/devices/:id', authMiddleware(pluginArgs), deviceManagementController.getDevice);
  router.put(
    '/devices/:id',
    authMiddleware(pluginArgs),
    adminOnly,
    deviceManagementController.updateDevice,
  );
  router.delete(
    '/devices/:id',
    authMiddleware(pluginArgs),
    adminOnly,
    deviceManagementController.deleteDevice,
  );

  // Session & build routes
  router.get('/session', getSessions);
  router.get('/build', getBuilds);
  router.post('/cleanup', cleanupBuilds);

  // Server/node routes
  router.get('/servers', getServers);
  router.get('/node/authenticate', authMiddleware(pluginArgs), authenticateNode);
  router.post('/node', authMiddleware(pluginArgs), registerNode);

  // Session detail routes
  router.get('/session/:sessionId/device_logs', getDeviceLogs);
  router.get('/session/:sessionId/session_log', getSessionLogs);
  router.get('/session/:sessionId/start_app_profiling', startAppProfiling);
  router.get('/session/:sessionId/app_profiling', stopAppProfiling);

  // Server logs
  router.get('/server/:nodeId/appium_logs', getAppiumLogs);

  // iOS device logs
  router.get('/ios/:sessionId/device_logs', getIosDeviceLogs);

  // App management routes
  router.post('/uploadedAppInformation', uploadAppInformation);
  router.get('/uploadedApps', getAppsInformation);
  router.post('/deleteUploadedApp', deleteUploadedApp);
  router.post('/upload', upload.single('file'), handleFileUpload);

  // Device tag/name routes
  router.post('/device-tag', authMiddleware(pluginArgs), addDeviceTags);
  router.post('/device-name', authMiddleware(pluginArgs), handleDeviceNameUpdate);
}

export default { register: registerRoutes };
