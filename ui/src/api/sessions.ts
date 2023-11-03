import Api from './index';

type ListResponse = {
  result: {
    count: number;
    rows: any[];
  };
};

export default class SessionApi {
  public static getAllSessions(filterParams?: Record<string, string>): Promise<ListResponse> {
    return Api.get('/sessions', filterParams || {});
  }

  public static getTextLogsForSession(sessionId: string): Promise<ListResponse> {
    return Api.get(`/sessions/${sessionId}/logs/text`, {});
  }

  public static getDeviceLogsForSession(sessionId: string): Promise<ListResponse> {
    return Api.get(`/sessions/${sessionId}/logs/device`, {});
  }

  public static getDebugLogsForSession(sessionId: string): Promise<ListResponse> {
    return Api.get(`/sessions/${sessionId}/logs/debug`, {});
  }

  public static getSessionById(sessionId: string) {
    return Api.get(`/sessions/${sessionId}`, {});
  }

  public static deleteSessionById(sessionId: string) {
    return Api.delete(`/sessions/${sessionId}`);
  }

  public static deleteAllSessions() {
    return Api.delete(`/sessions`);
  }

  public static getSessionTextLogs(sessionId: string) {
    return Api.get(`/sessions/${sessionId}/logs/text`, {});
  }

  public static pauseSession(sessionId: string) {
    return Api.post(`/debug/${sessionId}/pause`, {});
  }

  public static resumeSession(sessionId: string) {
    return Api.post(`/debug/${sessionId}/play`, {});
  }

  public static getAppProfilingForSession(sessionId: string) {
    return Api.get(`/sessions/${sessionId}/profiling_data`);
  }

  public static getHttpLogsForSession(sessionId: string) {
    return Api.get(`/sessions/${sessionId}/http_logs`);
  }

  public static runDriverScript({
    sessionId,
    script,
    timeoutMs,
  }: {
    sessionId: string;
    script: string;
    timeoutMs?: number;
  }) {
    return Api.post(`/debug/${sessionId}/execute_driver_script`, {
      script,
      timeout: timeoutMs,
    });
  }
}
