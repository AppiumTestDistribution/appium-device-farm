import { Application } from 'express';
import { Server } from 'http';
import { IExternalModuleLoader } from './interfaces/IExternalModule';
import { IPluginArgs } from './interfaces/IPluginArgs';
import { EventBus } from './notifier/event-bus';
import { Config } from './types/Config';
import { ServerArgs } from '@appium/types';

export class FakeModuleLoader implements IExternalModuleLoader {
  async onPluginLoaded(
    serverArgs: ServerArgs,
    pluginArgs: IPluginArgs,
    config: Config,
    bus: EventBus,
  ) {
    //no action
  }

  getMiddleWares() {
    return [];
  }

  async updateServer(app: Application, httpServer: Server) {
    //
  }
}
