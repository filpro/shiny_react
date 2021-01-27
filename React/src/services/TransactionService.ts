import axios, { AxiosResponse } from 'axios';
import Customer from '../models/Customer';
import Transaction from '../models/Transaction';
import Product from '../models/Product';
import Observable from '../utils/Observable';

export interface TransactionApi {
    transactionApiAddNew: string;
    transactionApiGetAll: string;
    transactionApiGetByDates: string;
    transactionApiUpdate: string;
    transactionApiDelete: string;
}

class TransactionService extends Observable {
    apiUrls?: TransactionApi;

    serviceReady = false;

    setApiUrl(urls: TransactionApi) {
        this.apiUrls = urls;
        this.serviceReady = true;
        this.notifyObservers();
    }

    async saveTransaction(transaction: Transaction): Promise<AxiosResponse<Transaction>> {
        const result = await axios.post(this.apiUrls!.transactionApiAddNew, transaction).catch((error) => error.response);
        return result;
    }

    async getAllTransactions(): Promise<AxiosResponse<Transaction[]>> {
        const result = await axios.get(this.apiUrls!.transactionApiGetAll).catch((error) => error.response);
        return result;
    }

    async getTransactionByDate(from: Date, to: Date): Promise<AxiosResponse<[Transaction[], Customer[], Product[]]>> {
        const result = await axios
            .get(this.apiUrls!.transactionApiGetByDates, {
                params: {
                    dateFrom: from,
                    dateTo: to,
                },
            })
            .catch((error) => error.response);
        return result;
    }

    async updateTransaction(transaction: Transaction): Promise<AxiosResponse<Transaction>> {
        const result = await axios.post(this.apiUrls!.transactionApiUpdate, transaction).catch((error) => error.response);
        return result;
    }

    async deleteTransaction(transaction: Transaction): Promise<AxiosResponse<string>> {
        const result = await axios.post(this.apiUrls!.transactionApiDelete, transaction).catch((error) => error.response);
        return result;
    }
}

export default new TransactionService();
