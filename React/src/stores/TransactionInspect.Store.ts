import { AxiosResponse } from 'axios';
import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import Customer from '../models/Customer';
import Product from '../models/Product';
import Transaction from '../models/Transaction';
import TransactionService from '../services/TransactionService';
import IObserver from '../utils/IObserver';

interface ITransactionStore {
    serverFilteredTransactions?: Transaction[];
    localFilteredTransactions?: Transaction[];
    serverFilteredCustomers?: Customer[];
    localFilteredCustomers?: Customer[];
    serverFilteredProducts?: Product[];
    localFilteredProducts?: Product[];
    localFilteredDates?: string[];
    dateFrom: Date;
    setDateFrom(dateFrom: Date | null): void;
    dateTo: Date;
    setDateTo(dateTo: Date | null): void;
    transmissionDatesFilter?: Date[];
    setTransmissionDatesFilter(dates: Date[]): void;
    customerIdsFilter?: Customer[];
    setCustomerIdsFilter(customers: Customer[], changeReason: string): void;
    productIdsFilter?: Product[];
    setProductIdsFilter(products: Product[], changeReason: string): void;
    getLocalFilteredCustomerById(id: string): Customer | undefined;
    getLocalFilteredProductById(id: string): Product | undefined;
    updateTransaction(transaction: Transaction): Promise<void>;
    deleteTransaction(transaction: Transaction): Promise<string>;
    isLoading: boolean;
    getServerFilteredData(): Promise<void>;
}

/** This is a store dedicated for inspecting Transactions.
 * Its responsible i.a. for communication with database (throught service),
 * rendering dropdown lists, transactions lists.
 */
export class TransactionController implements ITransactionStore, IObserver {
    constructor() {
        TransactionService.addObserver(this);
        this.setDefault();
    }

    update = (): void => {
        if (TransactionService.serviceReady) {
            this.getServerFilteredData();
            makeAutoObservable(this);
        }
    };

    async getServerFilteredData(): Promise<void> {
        this.isLoading = true;
        const result: AxiosResponse<[Transaction[], Customer[], Product[]]> = await TransactionService.getTransactionByDate(this.dateFrom, this.dateTo);
        [this.serverFilteredTransactions, this.serverFilteredCustomers, this.serverFilteredProducts] = result.data;
        this.isLoading = false;
        this.applyLocalFilter();
        this.updateDropdowns();
    }

    setDateFrom(dateFrom: Date): void {
        this.dateFrom = dateFrom;
        this.getServerFilteredData();
    }

    setDateTo(dateTo: Date): void {
        this.dateTo = dateTo;
        this.getServerFilteredData();
    }

    setProductIdsFilter = (products: Product[] | []): void => {
        this.productIdsFilter = products;
        this.applyLocalFilter();
        this.updateDropdowns();
    };

    setCustomerIdsFilter = (customers: Customer[] | []): void => {
        this.customerIdsFilter = customers;
        this.applyLocalFilter();
        this.updateDropdowns();
    };

    setTransmissionDatesFilter = (dates: Date[]): void => {
        this.transmissionDatesFilter = dates;
        this.applyLocalFilter();
        this.updateDropdowns();
    };

    private updateDropdowns = () => {
        this.updateProductDropdownList();
        this.updateCustomerDropdownList();
        this.updateDatesDropdownList();
    };

    async updateTransaction(transaction: Transaction): Promise<void> {
        const response = await TransactionService.updateTransaction(transaction);
        const updatedTransaction = response.data;

        const outdatedLocalTransactionIndex = this.localFilteredTransactions?.findIndex((x) => x.ID === updatedTransaction.ID);
        if (this.localFilteredTransactions && outdatedLocalTransactionIndex !== undefined) {
            this.localFilteredTransactions[outdatedLocalTransactionIndex] = updatedTransaction;
        }
        const outdatedServerTransactionIndex = this.serverFilteredTransactions?.findIndex((x) => x.ID === updatedTransaction.ID);
        if (this.serverFilteredTransactions && outdatedServerTransactionIndex !== undefined) {
            this.serverFilteredTransactions[outdatedServerTransactionIndex] = updatedTransaction;
        }
    }

    async deleteTransaction(transaction: Transaction): Promise<string> {
        const response = await TransactionService.deleteTransaction(transaction);
        const deletedTransactionId = response.data;

        this.getServerFilteredData();
        return deletedTransactionId;
    }

    applyLocalFilter = (): void => {
        this.localFilteredTransactions = this.serverFilteredTransactions
            ?.filter((x) => {
                // eslint-disable-next-line no-nested-ternary
                const isValidCustomerFilter = this.customerIdsFilter !== undefined && this.customerIdsFilter !== null && this.customerIdsFilter.length !== 0;
                const isValidProductFilter = this.productIdsFilter !== undefined && this.productIdsFilter !== null && this.productIdsFilter.length !== 0;
                const isValidTransmissionDatesFilter =
                    this.transmissionDatesFilter !== undefined && this.transmissionDatesFilter !== null && this.transmissionDatesFilter.length !== 0;
                return (
                    (isValidCustomerFilter ? this.customerIdsFilter?.map((customer) => customer.ID).includes(x.CUSTOMER_ID) : true) &&
                    (isValidProductFilter ? this.productIdsFilter?.map((product) => product.ID).includes(x.PRODUCT_ID) : true) &&
                    (isValidTransmissionDatesFilter ? this.transmissionDatesFilter?.includes(x.TRANSMISSION_ID) : true)
                );
            })
            .sort((n1, n2) => (n1.TRANSMISSION_ID < n2.TRANSMISSION_ID ? 1 : -1));
    };

    updateCustomerDropdownList = (): void => {
        const isValidProductFilter = this.productIdsFilter !== undefined && this.productIdsFilter !== null && this.productIdsFilter.length !== 0;
        const isValidTransactionDatesFilter =
            this.transmissionDatesFilter !== undefined && this.transmissionDatesFilter !== null && this.transmissionDatesFilter.length !== 0;

        if (isValidProductFilter || isValidTransactionDatesFilter) {
            const filteredCustomerIds = this.serverFilteredTransactions
                ?.filter(
                    (transaction) =>
                        (isValidProductFilter ? this.productIdsFilter?.map((product) => product.ID).includes(transaction.PRODUCT_ID) : true) &&
                        (isValidTransactionDatesFilter ? this.transmissionDatesFilter?.includes(transaction.TRANSMISSION_ID) : true)
                )
                .map((transaction) => transaction.CUSTOMER_ID);
            const uniqueFilteredCustomerIds = filteredCustomerIds?.filter((x, i, a) => a.indexOf(x) === i);

            this.localFilteredCustomers = this.serverFilteredCustomers?.filter((customer) => uniqueFilteredCustomerIds?.includes(customer.ID));
        } else {
            this.localFilteredCustomers = this.serverFilteredCustomers;
        }
        this.localFilteredCustomers = this.localFilteredCustomers?.sort((cust1, cust2) => (cust1.FIRST_NAME > cust2.FIRST_NAME ? 1 : -1));
    };

    updateProductDropdownList = (): void => {
        const isValidCustomerFilter = this.customerIdsFilter !== undefined && this.customerIdsFilter !== null && this.customerIdsFilter.length !== 0;
        const isValidTransactionDatesFilter =
            this.transmissionDatesFilter !== undefined && this.transmissionDatesFilter !== null && this.transmissionDatesFilter.length !== 0;

        if (isValidCustomerFilter || isValidTransactionDatesFilter) {
            const filteredProductIds = this.serverFilteredTransactions
                ?.filter(
                    (transaction) =>
                        (isValidCustomerFilter ? this.customerIdsFilter?.map((customer) => customer.ID).includes(transaction.CUSTOMER_ID) : true) &&
                        (isValidTransactionDatesFilter ? this.transmissionDatesFilter?.includes(transaction.TRANSMISSION_ID) : true)
                )
                .map((transaction) => transaction.PRODUCT_ID);
            const uniqueFilteredProductIds = filteredProductIds?.filter((x, i, a) => a.indexOf(x) === i);

            this.localFilteredProducts = this.serverFilteredProducts?.filter((product) => uniqueFilteredProductIds?.includes(product.ID));
        } else {
            this.localFilteredProducts = this.serverFilteredProducts;
        }

        this.localFilteredProducts = this.localFilteredProducts?.sort((prod1, prod2) => (prod1.PRODUCT_NAME > prod2.PRODUCT_NAME ? 1 : -1));
    };

    updateDatesDropdownList = (): void => {
        const isValidCustomerFilter = this.customerIdsFilter !== undefined && this.customerIdsFilter !== null && this.customerIdsFilter.length !== 0;
        const isValidProductFilter = this.productIdsFilter !== undefined && this.productIdsFilter !== null && this.productIdsFilter.length !== 0;
        let tempLocalFilteredDates: string[] | undefined = [];

        if (isValidCustomerFilter || isValidProductFilter) {
            tempLocalFilteredDates = this.serverFilteredTransactions
                ?.filter(
                    (transaction) =>
                        (isValidCustomerFilter ? this.customerIdsFilter?.map((customer) => customer.ID).includes(transaction.CUSTOMER_ID) : true) &&
                        (isValidProductFilter ? this.productIdsFilter?.map((product) => product.ID).includes(transaction.PRODUCT_ID) : true)
                )
                .map((transaction) => transaction.TRANSMISSION_ID.toString())
                .filter((x, i, a) => a.indexOf(x) === i);
        } else {
            tempLocalFilteredDates = this.serverFilteredTransactions
                ?.map((transaction) => transaction.TRANSMISSION_ID.toString())
                .filter((x, i, a) => a.indexOf(x) === i);
        }

        this.localFilteredDates = tempLocalFilteredDates?.sort((date1, date2) => Date.parse(date2) - Date.parse(date1));
    };

    getLocalFilteredCustomerById = (id: string): Customer | undefined => {
        return this.localFilteredCustomers ? this.localFilteredCustomers?.find((customer) => customer.ID === id) : undefined;
    };

    getLocalFilteredProductById = (id: string): Product | undefined => {
        return this.localFilteredProducts ? this.localFilteredProducts?.find((product) => product.ID === id) : undefined;
    };

    serverFilteredTransactions?: Transaction[];

    localFilteredTransactions?: Transaction[];

    serverFilteredCustomers?: Customer[];

    localFilteredCustomers?: Customer[];

    serverFilteredProducts?: Product[];

    localFilteredProducts?: Product[];

    localFilteredDates?: string[];

    dateFrom!: Date;

    dateTo!: Date;

    transmissionDatesFilter?: Date[];

    customerIdsFilter?: Customer[];

    productIdsFilter?: Product[];

    isLoading!: boolean;

    private setDefault(): void {
        const today = new Date();
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        this.dateFrom = monthAgo;
        this.dateTo = today;
        this.isLoading = false;
    }
}

export default createContext<ITransactionStore>(new TransactionController());
