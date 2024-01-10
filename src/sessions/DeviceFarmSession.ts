import { DEVICE_FARM_CAPABILITIES } from '../CapabilityManager';
import SessionType from '../enums/SessionType';
import { IDevice } from '../interfaces/IDevice';

export type DeviceFarmSessionOptions = {
  sessionId: string;
  deviceFarmOption: Record<string, any>;
  device: IDevice;
  sessionResponse: Record<string, any>;
};

export abstract class DeviceFarmSession {
  protected sessionId: string;
  protected deviceFarmOption: Record<string, any>;

  constructor(private options: DeviceFarmSessionOptions) {
    this.sessionId = options.sessionId;
    this.deviceFarmOption = options.deviceFarmOption;
  }

  getId(): string {
    return this.sessionId;
  }

  getDeviefarmOptions(): Record<string, any> {
    return this.deviceFarmOption;
  }

  getCapabilities(): Record<string, any> {
    return this.options.sessionResponse;
  }

  getDeviceFarmOption(
    option: DEVICE_FARM_CAPABILITIES,
    defaultValue: any = undefined,
  ): string | undefined {
    return this.deviceFarmOption[option] ? this.deviceFarmOption[option] : defaultValue;
  }

  abstract getScreenShot(): Promise<string>;

  abstract stopVideoRecording(): Promise<string | null>;

  abstract startVideoRecording(options?: { resolution: string } | undefined): Promise<void>;

  abstract isVideoRecordingInProgress(): boolean;

  abstract getType(): SessionType;

  abstract getLiveVideoUrl(): string | null;
}
