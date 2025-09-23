
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CreateRedemption } from '../types';

export class RedemptionClient {
  private _client: AxiosInstance;
  private _prefix = 'redemption';

  constructor(private apiClient: AxiosInstance) {
    this._client = apiClient;
  }

  async create(data: CreateRedemption, config?: AxiosRequestConfig) {
    const response = await this._client.post(`${this._prefix}`, data, config);
    return response 
  }

  async list(data?:any, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}`, {
      params: data,
      ...config,
    });
    return response
  }
  

  async findOne(cuid: string, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/${cuid}`, config);
    return response
  }

  
  async delete(cuid: string, config?: AxiosRequestConfig) {
    const response = await this._client.delete(`${this._prefix}/${cuid}`, config);
    return response
  }
}
