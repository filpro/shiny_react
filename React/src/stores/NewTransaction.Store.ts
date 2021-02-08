import { AxiosResponse } from 'axios';
import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import Product from '../models/Product';
import Transaction from '../models/Transaction';
import ProductService from '../services/ProductService';
import TransactionService from '../services/TransactionService';
import IObserver from '../utils/IObserver';

interface INewTransactionStore {
    loadAllTransactions(): Promise<void>;
    addTransaction(product: Product, transaction: Transaction): Promise<Transaction>;
    allTransactions?: Transaction[];
    newTransacstion?: Transaction;
    checkingIfTransactionExistsForProductName: boolean;
    doesTransactionExistForProductName?: boolean;
    isFetchSucceed?: boolean;
    httpStatus?: number;
    checkIfExistsTransaction(): Promise<void>;
    isLoading: boolean;
    newTransactionDate: Date;
    setNewTransactionDate(date: Date): void;
    newProductName: string;
    setNewProductName(name: string): void;
    newProductPrice: string;
    setNewProductPrice(price: string): void;
    isAdding: boolean;
}

export class NewTransactionController implements INewTransactionStore, IObserver {
    constructor() {
        TransactionService.addObserver(this);
        ProductService.addObserver(this);
        if (TransactionService.serviceReady && ProductService.serviceReady) this.setup();
    }

    update(): void {
        if (TransactionService.serviceReady && ProductService.serviceReady) this.setup();
    }

    private setup(): void {
        this.setDefaults();
        this.loadAllTransactions();
        makeAutoObservable(this);
    }

    async addTransaction(product: Product, transaction: Transaction): Promise<Transaction> {
        this.isAdding = true;
        const newProductResponse: AxiosResponse<Product> = await ProductService.saveProduct(product);
        const newProduct = newProductResponse.data;
        const tempTransaction = { ...transaction };
        tempTransaction.PRODUCT_ID = newProduct.ID;
        const newTransaction: AxiosResponse<Transaction> = await TransactionService.saveTransaction(tempTransaction);
        this.newTransaction = newTransaction.data;
        this.isAdding = false;
        return newTransaction.data;
    }

    async loadAllTransactions(): Promise<void> {
        this.isLoading = true;
        const serverResponse: AxiosResponse<Transaction[]> = await TransactionService.getAllTransactions();
        const response = serverResponse;
        this.allTransactions = response.data;
        this.isLoading = false;
    }

    async checkIfExistsTransaction(): Promise<void> {
        if (this.newProductName && this.newTransactionDate) {
            this.checkingIfTransactionExistsForProductName = true;
            const serverResponse: AxiosResponse<boolean> = await ProductService.checkIfExistsTransaction(this.newProductName, this.newTransactionDate);
            this.doesTransactionExistForProductName = serverResponse ? serverResponse.data : undefined;
            this.checkingIfTransactionExistsForProductName = false;
        } else {
            this.doesTransactionExistForProductName = undefined;
        }
    }

    setNewTransactionDate = (date: Date): void => {
        this.newTransactionDate = date;
        this.checkIfExistsTransaction();
    };

    setNewProductName = (name: string): void => {
        this.newProductName = name;
        this.checkIfExistsTransaction();
    };

    setNewProductPrice = (price: string): void => {
        this.newProductPrice = price;
    };

    setDefaults = (): void => {
        this.newTransactionDate = new Date();
        this.newProductName = '';
        this.newProductPrice = '';
    };

    isLoading = false;

    isAdding = false;

    newTransaction?: Transaction;

    allTransactions?: Transaction[];

    isFetchSucceed?: boolean | undefined;

    httpStatus?: number | undefined;

    doesTransactionExistForProductName?: boolean;

    checkingIfTransactionExistsForProductName = false;

    newTransactionDate!: Date;

    newProductName!: string;

    newProductPrice!: string;
}

export default createContext<INewTransactionStore>(new NewTransactionController());
