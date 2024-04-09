export interface ISession {
  id: string;
  buildId: string;
  name: string | null;
  status: string;
  desiredCapabilities: string;
  sessionCapabilities: string;
  nodeId: string;
  hasLiveVideo: boolean;
  videoRecording: string | null;
  startTime: string;
  endTime: string | null;
  failureReason: string | null;
  deviceUDID: string;
  devicePlatform: string;
  deviceVersion: string;
  deviceName: string;
  createdAt: string;
  updatedAt: string;
  live?: string;
}
