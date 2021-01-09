import { AxiosResponse } from 'axios';
import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import Product from '../models/Product';
import Transaction from '../models/Transaction';
import ProductService from '../services/ProductService';
import TransactionService from '../services/TransactionService';

interface ITransactionStore {
    loadAllTransactions(): Promise<void>;
    addTransaction(product: Product, transaction: Transaction): Promise<void>;
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

    async addTransaction(product: Product, transaction: Transaction): Promise<void> {
        const newProductResponse: AxiosResponse<Product> = await ProductService.saveProduct(product);
        const newProduct = newProductResponse.data;
        transaction.PRODUCT_ID = newProduct.ID;
        const newTransaction: AxiosResponse<Transaction> = await TransactionService.saveTransaction(transaction);
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
