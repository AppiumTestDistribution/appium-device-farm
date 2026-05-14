import apiClient from '../api-service/api-client';

export interface Device {
  id: string;
  udid: string;
  host: string;
  nodeId: string;
  platform: 'android' | 'ios';
  version: string;
  name: string;
  tags: string | null;
  real: boolean;
  isActive: boolean;
  isFlagged: boolean;
  flaggedReason?: string;
  usage: number;
  createdAt: string;
  updatedAt: string;
}

class DeviceService {
  public async listDevicesForPermissions(): Promise<Device[]> {
    try {
      const response = await apiClient.makeGETRequest('/device-allocations/all', {});
      return response;
    } catch (error) {
      throw new Error('Error getting all teams');
    }
  }

  async listDevices(): Promise<Device[]> {
    const response = await apiClient.makeGETRequest('/dashboard/devices', {});
    return response;
  }

  async getDevice(id: string): Promise<Device> {
    const response = await apiClient.makeGETRequest(`/dashboard/devices/${id}`, {});
    return response;
  }

  async updateDevice(
    id: string,
    data: Pick<Device, 'name' | 'tags' | 'flaggedReason' | 'isFlagged'>,
  ): Promise<Device> {
    const response = await await apiClient.makePUTRequest(`/dashboard/devices/${id}`, {}, data);
    return response;
  }

  async deleteDevice(id: string): Promise<void> {
    await await apiClient.makeDELETERequest(`/dashboard/devices/${id}`);
  }

  // async addDeviceTags(host: string, udid: string, tags: string[]): Promise<void> {
  //   await axios.post(`${API_BASE_URL}/dashboard/device-tag`, { host, udid, tags });
  // },

  // async updateDeviceName(host: string, udid: string, name: string): Promise<void> {
  //   await axios.post(`${API_BASE_URL}/dashboard/device-name`, { host, udid, name });
  // },
}

export default new DeviceService();
