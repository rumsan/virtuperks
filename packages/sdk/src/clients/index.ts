// import { RumsanClient } from '@rumsan/sdk/clients';
// import { CreateAxiosDefaults } from 'axios';
// import { RedemptionClient } from './redemption.client';
// import { RewardClient } from './reward.client';

// export class ApiClient extends RumsanClient {
//     private eventEmitter?: any;

// constructor(config: CreateAxiosDefaults, eventEmitter?: any) {
//     super(config);
//     this.eventEmitter = eventEmitter;
//     this.apiClient.interceptors.response.use(
//         (response) => response,
//         (error) => {
//             throw error;
//         }
//     );
// }
    
//     public get reward() { 
//  return new RewardClient(this.apiClient);


//     }

//     public get redemption() {
//         return new RedemptionClient(this.apiClient);
//     }





// }

// export const ApiService = new ApiClient({}, null)