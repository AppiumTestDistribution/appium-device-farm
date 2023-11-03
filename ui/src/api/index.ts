import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';

const defaultConfig = {
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`,
};

function paramsSerializer(params: any) {
  return qs.stringify(params, { arrayFormat: 'comma' });
}

export default class Api {
  static base_url = process.env.REACT_APP_API_BASE_URL;

  static get(url: string, params?: any, config: Partial<AxiosRequestConfig> = {}) {
    return axios
      .get(url, {
        ...defaultConfig,
        ...config,
        params,
        paramsSerializer,
      })
      .then((response) => response.data)
      .catch((err) => err.response.data);
  }

  static post(
    url: string,
    payload: any = {},
    params?: any,
    config: Partial<AxiosRequestConfig> = {}
  ) {
    return axios
      .post(url, payload, {
        ...defaultConfig,
        ...config,
        params,
        paramsSerializer,
      })
      .then((response) => response.data)
      .catch((err) => err.response.data);
  }

  static delete(url: string, params?: any, config: Partial<AxiosRequestConfig> = {}) {
    return axios
      .delete(url, {
        ...defaultConfig,
        ...config,
        params,
        paramsSerializer,
      })
      .then((response) => response.data)
      .catch((err) => err.response.data);
  }
}
