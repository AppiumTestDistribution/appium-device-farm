export interface ISessionLogs {
  id: string;
  session_id: string;
  commandName: string;
  url: string;
  method: string;
  title: string;
  subtitle: string;
  body: string;
  response: string;
  screenshot: string | null;
  isSuccess: boolean;
  createdAt: string;
  updatedAt: string;
}
