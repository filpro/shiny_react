import axios, { AxiosResponse } from 'axios';
import Transaction from '../models/Transaction';

export interface TransactionApi {
    transactionApiAddNew: string;
    transactionApiGetAll: string;
}

class TransactionService {
    apiUrls?: TransactionApi;

    setApiUrl(urls: TransactionApi) {
        this.apiUrls = urls;
    }

    async saveTransaction(transaction: Transaction): Promise<AxiosResponse<Transaction>> {
        const result = await axios.post(this.apiUrls!.transactionApiAddNew, transaction).catch((error) => error.response);
        return result;
    }

    async getAllTransactions(): Promise<AxiosResponse<Transaction[]>> {
        const result = await axios.get(this.apiUrls!.transactionApiGetAll).catch((error) => error.response);
        return result;
    }
}

export default new TransactionService();
