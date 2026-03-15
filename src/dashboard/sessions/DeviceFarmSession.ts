import { DEVICE_FARM_CAPABILITIES } from '../../CapabilityManager';
import SessionType from '../../enums/SessionType';
import { IDeviceFarmSessionOptions } from '../../interfaces/IDeviceFarmSession';

export abstract class DeviceFarmSession {
  protected sessionId: string;
  protected deviceFarmOption: Record<string, any>;

  constructor(protected options: IDeviceFarmSessionOptions) {
    this.sessionId = options.sessionId;
    this.deviceFarmOption = options.deviceFarmCapabilities;
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

  abstract startVideoRecording(
    options?: { resolution: string; timeLimit?: number } | undefined,
  ): Promise<void>;

  abstract isVideoRecordingInProgress(): boolean;

  abstract getType(): SessionType;

  abstract getLiveVideoUrl(): string | null;

  abstract startDeviceLog(): Promise<void>;

  abstract getDeviceLogs(force?: boolean): Promise<Array<any> | null>;

  abstract startAppProfiling(): Promise<boolean>;

  abstract stopAppProfiling(): Promise<any>;
}
