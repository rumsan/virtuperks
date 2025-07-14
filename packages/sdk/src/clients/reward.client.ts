import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Pagination } from '../types/pagination.type';
import { CreateReward, EditReward, Reward } from '../types/reward.type';
import { formatResponse } from '../utils/formatResponse.utils';


  
  export class RewardClient {
    private _client: AxiosInstance;
    private _prefix = 'reward';
    constructor(private apiClient: AxiosInstance) {
      this._client = apiClient;
    }
  
    async create(data: CreateReward, config?: AxiosRequestConfig) {
      const response = await this._client.post(`${this._prefix}`, data, config);
      return formatResponse<Reward>(response);
    }
  
    async list(data?: Pagination, config?: AxiosRequestConfig) {
      const response = await this._client.get(`${this._prefix}`, {
        params: data,
        ...config,
      });
      return formatResponse<Reward[]>(response);
    }
  
    
  //    // Fetch all available rewards
  // async list(config?: AxiosRequestConfig) {
  //   const response = await this._client.get(`${this._prefix}`, config);
  //   return formatResponse<Reward[]>(response);
  //   }
    
    async get(id: string, config?: AxiosRequestConfig) {
      const response = await this._client.get(`${this._prefix}/${id}`, config);
      return formatResponse<Reward>(response);
    }
  
    async update(id: string, data: EditReward, config?: AxiosRequestConfig) {
      const response = await this._client.put(
        `${this._prefix}/${id}`,
        data,
        config,
      );
      return formatResponse<Reward>(response);
    }
  
    // async delete(id: string, config?: AxiosRequestConfig) {
    //   const response = await this._client.delete(`${this._prefix}/${id}`, config);
    //   return formatResponse<Reward>(response);
    // }
  }
  