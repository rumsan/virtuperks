import type { CreateUser, UpdateUser } from '@workspace/sdk/types/users.type';
import { AxiosInstance, AxiosRequestConfig } from 'axios';


export class UserClient {
  private _client: AxiosInstance;
  private _prefix = 'users';

  constructor(apiClient: AxiosInstance) {
    this._client = apiClient;
  }

  /**
   * Get all users (with limited details)
   */
  async findAll(config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}`, config);
    return response.data;
  }

  /**
   * Get user by cuid
   */
  async findOne(cuid: string, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/${cuid}`, config);
    return response.data;
  }

  /**
   * Get user by wallet
   */
  async findByWallet(wallet: string, config?: AxiosRequestConfig) {
    const response = await this._client.get(`${this._prefix}/wallet/${wallet}`, config);
    return response.data;
  }

  /**
   * Create a new user
   */
  async create(data: CreateUser, config?: AxiosRequestConfig) {
    const response = await this._client.post(`${this._prefix}`, data, config);
    return response.data;
  }

  /**
   * Update existing user by cuid
   */
  async update(cuid: string, data: UpdateUser, config?: AxiosRequestConfig) {
    const response = await this._client.patch(`${this._prefix}/${cuid}`, data, config);
    return response.data;
  }
}
