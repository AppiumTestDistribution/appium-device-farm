import api from '../api';
import _ from 'lodash';

export default class CommonUtils {
  public static getTimeDiffInSecs(startDate: Date, endDate: Date) {
    return Math.ceil((endDate.getTime() - startDate.getTime()) / 1000);
  }

  public static convertTimeToReadableFormat(startDate: Date, endDate: Date) {
    const readableDuration = CommonUtils.getReadableDuration(startDate, endDate);

    return readableDuration.trim();
  }

  public static getReadableDuration(startDate: Date, endDate: Date) {
    const seconds = Math.round((endDate.getTime() - startDate.getTime()) / 1000);
    if (seconds <= 0) {
      return `${Math.round(endDate.getTime() - startDate.getTime())} ms`;
    }
    const levels: any = [
      [Math.floor(seconds / 31536000), 'y'],
      [Math.floor((seconds % 31536000) / 86400), 'd'],
      [Math.floor(((seconds % 31536000) % 86400) / 3600), 'h'],
      [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'm'],
      [(((seconds % 31536000) % 86400) % 3600) % 60, 's'],
    ];
    let returntext = '';

    for (let i = 0, max = levels.length; i < max; i++) {
      if (levels[i][0] === 0) continue;
      returntext += ' ' + levels[i][0] + levels[i][1];
    }

    return `${returntext}`;
  }

  public static filterSessionList(sessions: any[], filter: any) {
    const filters: any = [];
    if (filter.name) {
      filters.push(
        (session: any) =>
          session.session_id.indexOf(filter.name) >= 0 ||
          session.name?.toLowerCase().indexOf(filter.name.toLowerCase()) >= 0
      );
    }
    if (filter.os) {
      filters.push(
        (session: any) => session.platform_name.toLowerCase() == filter.os.toLowerCase()
      );
    }

    if (filter.status) {
      filters.push(
        (session: any) => session.session_status.toLowerCase() == filter.status.toLowerCase()
      );
    }

    if (filter.device_udid) {
      filters.push(
        (session: any) => session.udid?.toLowerCase().indexOf(filter.device_udid.toLowerCase()) >= 0
      );
    }

    return filters.reduce((acc: any, filter: any) => {
      return acc.filter(filter);
    }, sessions);
  }

  static urlParamsToObject(urlParams: URLSearchParams) {
    return Object.fromEntries(urlParams);
  }

  static parseJsonSchema(schema: any, obj: any) {
    const parsedObject: any = {};

    Object.keys(schema).forEach((key) => {
      if (obj[key]) {
        if (!schema[key].valid) {
          parsedObject[key] = obj[key];
        } else if (schema[key].valid) {
          if (typeof schema[key].valid === 'function' && schema[key].valid(obj[key])) {
            parsedObject[key] = obj[key];
          } else if (Array.isArray(schema[key].valid) && schema[key].valid.indexOf(obj[key]) >= 0) {
            parsedObject[key] = obj[key];
          }
        }
      }
    });
    return parsedObject;
  }

  public static parseJson(str: any) {
    if (_.isString(str)) {
      try {
        return JSON.stringify(JSON.parse(str), null, 2);
      } catch (err) {}
    }
    return str;
  }

  static getVideoForSession(sessionId: string) {
    return `${api.base_url}/api/sessions/${sessionId}/video`;
  }

  static getDownloadVideoForSession(sessionId: string) {
    return `${api.base_url}/api/sessions/${sessionId}/video/download`;
  }

  static getLiveVideoForSession(sessionId: string) {
    return `${api.base_url}/api/sessions/${sessionId}/live_video`;
  }

  static getScreenshotForLog(sessionId: string, logId: string) {
    return `${api.base_url}/api/sessions/${sessionId}/log/${logId}/screen-shot`;
  }

  static hash(object: any) {
    return JSON.stringify(object);
  }
}
