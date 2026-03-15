import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { DevicePlugin } from '../../plugin';
import { getDevice } from '../../data-service/device-service';

export async function proxyRequestToNode(request: Request, response: Response, next: NextFunction) {
  const regex = /(?:android|ios)\/([^/]+)/;
  const match = request.originalUrl.match(regex);
  const sessionId = match ? match[1] : null;

  if (!sessionId) {
    return response.status(400).json({ error: 'sessionId is required' });
  }

  try {
    const device = await getDevice({ session_id: sessionId });
    if (!device) {
      return response.status(404).json({ error: 'Device not found' });
    }
    if (device.nodeId === DevicePlugin.NODE_ID) {
      (request as any).device = device;
      return next();
    }

    // Create proxy for requests to other nodes
    const proxy = createProxyMiddleware({
      target: device.host,
      changeOrigin: true,
      secure: false,
      pathRewrite: (path, req) => {
        return request.originalUrl;
      },
      on: {
        proxyReq: (proxyReq, req) => {
          if (!new RegExp(/post|put|patch/g).test(proxyReq.method.toLowerCase())) {
            return;
          }

          const contentType = proxyReq.getHeader('Content-Type') as string;

          if (contentType && contentType.includes('application/json') && (req as any).body) {
            const bodyData = JSON.stringify((req as any).body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
          }
        },
        error: (err, req, res: any) => {
          console.error('Proxy Error:', err);
          if (!res.headersSent && res.status) {
            res.status(500).json({ error: 'Failed to proxy request to node' });
          }
        },
        // Preserve original headers including authentication
        proxyRes: (proxyRes, req, res) => {
          // Preserve the original headers for file downloads
          Object.keys(proxyRes.headers).forEach((key) => {
            const headerValue = proxyRes.headers[key];
            if (headerValue) {
              res.setHeader(key, headerValue);
            }
          });
        },
      },
    });

    // Execute the proxy middleware
    return proxy(request, response, next);
  } catch (error) {
    console.error('Proxy Middleware Error:', error);
    return response.status(500).json({ error: 'Internal server error in proxy middleware' });
  }
}
