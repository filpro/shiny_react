import { AxiosResponse } from 'axios';
import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import Transaction from '../models/Transaction';
import TransactionService from '../services/TransactionService';

interface ITransactionStore {
    loadAllTransactions(): Promise<void>;
    addTransaction(customer: Transaction): Promise<void>;
    allTransactions?: Transaction[];
    newTransacstion?: Transaction;
    isFetchSucceed?: boolean;
    httpStatus?: number;
}

export class TransactionController implements ITransactionStore {
    constructor() {
        this.loadAllTransactions();
        makeAutoObservable(this);
    }

    async addTransaction(customer: Transaction): Promise<void> {
        const newTransaction: AxiosResponse<Transaction> = await TransactionService.saveTransaction(customer);
        this.newTransaction = newTransaction.data;
    }

    async loadAllTransactions(): Promise<void> {
        const serverResponse: AxiosResponse<Transaction[]> = await TransactionService.getAllTransactions();
        const response = serverResponse;
        this.allTransactions = response.data;
    }

    newTransaction?: Transaction;

    allTransactions?: Transaction[];

    isFetchSucceed?: boolean | undefined;

    httpStatus?: number | undefined;
}

export default createContext<ITransactionStore>(new TransactionController());
