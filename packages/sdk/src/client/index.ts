import { RumsanClient } from '@rumsan/sdk/clients';
import { UserClient } from "@workspace/sdk/client/user.client";
import { CreateAxiosDefaults } from 'axios';

export class ApiClient extends RumsanClient {
  private eventEmitter: any;
    declare apiClient: any;
  constructor(config: CreateAxiosDefaults, eventEmitter?: any) {
    super(config);
    this.eventEmitter = eventEmitter;
    this.apiClient.interceptors.response.use(
      (response: any) => response,
      (err: any) => {
        throw err;
      },
    );
  }

  public get Participants() {
    return new UserClient(this.apiClient);
  }
}

export const ApiService = new ApiClient({}, null);
