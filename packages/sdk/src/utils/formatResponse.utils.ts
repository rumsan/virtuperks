import { AxiosResponse } from 'axios';
import { Response } from '../types/response.types';

type FormattedResponse<T> = {
    data: T;
    response: Response<T>;
    httpReponse: AxiosResponse;
};
declare const formatResponse: <T>(response: AxiosResponse) => FormattedResponse<T>;

export { formatResponse, type FormattedResponse };

