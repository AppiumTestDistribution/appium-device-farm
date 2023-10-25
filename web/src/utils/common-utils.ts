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
}
