import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CreateRedemption, Redemption } from '../types/redemption.type';
import { formatResponse } from '../utils/formatResponse.utils';

export class RedemptionClient {
  private _client: AxiosInstance;
  private _prefix = 'redemption';

  constructor(private apiClient: AxiosInstance) {
    this._client = apiClient;
  }

  
  async redeem(data: CreateRedemption, config?: AxiosRequestConfig) {
    const response = await this._client.post(`${this._prefix}`, data, config);
    return formatResponse<Redemption>(response);
  }

 
  async getRedemptions(userId: string, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/user/${userId}`, config);
    return formatResponse<Redemption[]>(response);
  }
}
