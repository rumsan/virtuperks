 import { CommonFields } from "./common.type";


export type PhoneBase = {

    phoneNumber: string;
    userWalletAddress: string;
  
};
export type Phone = PhoneBase & CommonFields  & {cuid: string};
export type  CreatePhone =  PhoneBase
export type EditPhone = Partial<CreatePhone> & { cuid: string };



