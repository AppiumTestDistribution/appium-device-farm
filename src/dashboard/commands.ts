import { Request } from 'express';

//TODO
export class DashboardCommands {
  public setTestName(req: Request, res: Response) {
    console.log(req, res);
  }
}

export const dashboardCommands = new DashboardCommands();
