
import { Pagination } from '@rumsan/sdk/types';
import { formatResponse } from '@rumsan/sdk/utils/formatResponse.utils';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CreateRedemption, Redemption } from '../types';

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

  async list(data?: Pagination, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}`, {
      params: data,
      ...config,
    });
    return formatResponse<Redemption[]>(response);
  }

  async search(
    params?: Pagination,
    filters?: any,
    config?: AxiosRequestConfig,
  ) {
   
     const response = await this._client.post(
      `${this._prefix}/search`,
      filters,
      {
        params,
        ...config,
      },
    );
    return formatResponse<Redemption[]>(response);
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
