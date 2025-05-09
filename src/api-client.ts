import { Node } from '@prisma/client';
import axios, { Axios } from 'axios';

export class DeviceFarmApiClient {
  private axiosClient: Axios;

  constructor(
    private accessKey: string,
    private secretKey: string,
    private baseUrl: string,
  ) {
    this.axiosClient = axios.create({
      baseURL: `${this.baseUrl}/device-farm/api`,
      headers: {
        Authorization: `Basic ${Buffer.from(`${this.accessKey}:${this.secretKey}`).toString('base64')}`,
      },
    });
  }

  authenticate() {
    return this.axiosClient.get('/dashboard/node/authenticate');
  }

  registerNode(nodeDetails: Partial<Node>) {
    return this.axiosClient.post('/dashboard/node', nodeDetails);
  }
}
