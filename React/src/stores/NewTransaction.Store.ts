import { AxiosResponse } from 'axios';
import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import Product from '../models/Product';
import Transaction from '../models/Transaction';
import ProductService from '../services/ProductService';
import TransactionService from '../services/TransactionService';
import IObserver from '../utils/IObserver';

interface ITransactionStore {
    loadAllTransactions(): Promise<void>;
    addTransaction(product: Product, transaction: Transaction): Promise<Transaction>;
    allTransactions?: Transaction[];
    newTransacstion?: Transaction;
    checkingIfTransactionExistsForProductName?: boolean;
    doesTransactionExistForProductName?: boolean;
    isFetchSucceed?: boolean;
    httpStatus?: number;
    checkIfExistsTransaction(productName?: string, transactionDate?: Date | null): Promise<void>;
}

export class TransactionController implements ITransactionStore, IObserver {
    constructor() {
        TransactionService.addObserver(this);
        if (TransactionService.serviceReady) this.setup();
    }

    update(): void {
        if (TransactionService.serviceReady) this.setup();
    }

    private setup(): void {
        this.loadAllTransactions();
        makeAutoObservable(this);
    }

    async addTransaction(product: Product, transaction: Transaction): Promise<Transaction> {
        const newProductResponse: AxiosResponse<Product> = await ProductService.saveProduct(product);
        const newProduct = newProductResponse.data;
        const tempTransaction = { ...transaction };
        tempTransaction.PRODUCT_ID = newProduct.ID;
        const newTransaction: AxiosResponse<Transaction> = await TransactionService.saveTransaction(tempTransaction);
        this.newTransaction = newTransaction.data;
        return newTransaction.data;
    }

    async loadAllTransactions(): Promise<void> {
        const serverResponse: AxiosResponse<Transaction[]> = await TransactionService.getAllTransactions();
        const response = serverResponse;
        this.allTransactions = response.data;
    }

    async checkIfExistsTransaction(productName?: string, transactionDate?: Date | null): Promise<void> {
        if (productName && transactionDate) {
            this.checkingIfTransactionExistsForProductName = true;
            const serverResponse: AxiosResponse<boolean> = await ProductService.checkIfExistsTransaction(productName, transactionDate);
            this.doesTransactionExistForProductName = serverResponse ? serverResponse.data : undefined;
            this.checkingIfTransactionExistsForProductName = false;
        } else {
            this.doesTransactionExistForProductName = false;
        }
    }

    newTransaction?: Transaction;

    allTransactions?: Transaction[];

    isFetchSucceed?: boolean | undefined;

    httpStatus?: number | undefined;

    doesTransactionExistForProductName?: boolean;

    checkingIfTransactionExistsForProductName?: boolean;
}

export default createContext<ITransactionStore>(new TransactionController());
