export interface ISessionLogs {
  id: string;
  session_id: string;
  command_name: string;
  url: string;
  method: string;
  title: string;
  subtitle: string;
  body: string;
  response: string;
  screenshot: string | null;
  is_success: boolean;
  createdAt: string;
  updatedAt: string;
}