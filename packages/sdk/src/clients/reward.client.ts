
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CreateReward } from '../types';

export class RewardClient {
  private _client: AxiosInstance;
  private _prefix = 'reward';

  constructor(private apiClient: AxiosInstance) {
    this._client = apiClient;
  }

  async create(data: CreateReward, config?: AxiosRequestConfig) {
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

  async findPhonebyWallet(userWalletAddress: string, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/phone/${userWalletAddress}`, config);
    return response
  }

  
  async delete(cuid: string, config?: AxiosRequestConfig) {
    const response = await this._client.delete(`${this._prefix}/${cuid}`, config);
    return response
  }
}
