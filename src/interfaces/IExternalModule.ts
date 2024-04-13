import { Application, Request, Response, NextFunction } from 'express';
import { IPluginArgs } from './IPluginArgs';
import { EventBus } from '../notifier/event-bus';
import { Config } from '../types/Config';
import http from 'http';
import { ServerArgs, ServerConfig } from '@appium/types';
import ADB from 'appium-adb';

export type ExpressMiddleware = (request: Request, response: Response, next: NextFunction) => void;

export interface IExternalModuleLoader {
  onPluginLoaded(
    serverArgs: ServerArgs,
    pluginArgs: IPluginArgs,
    config: Config,
    httpServer: any,
    bus: EventBus,
    adb: ADB,
  ): Promise<void>;

  getMiddleWares(): ExpressMiddleware[];

  updateServer(app: Application, httpServer: http.Server): Promise<void>;
}
