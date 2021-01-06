import { AxiosResponse } from 'axios';
import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import Customer from '../models/Customer';
import Product from '../models/Product';
import Transaction from '../models/Transaction';
import TransactionService from '../services/TransactionService';

interface ITransactionStore {
    serverFilteredTransactions?: Transaction[];
    localFilteredTransactions?: Transaction[];
    serverFilteredCustomers?: Customer[];
    localFilteredCustomers?: Customer[];
    serverFilteredProducts?: Product[];
    localFilteredProducts?: Product[];
    dateFrom: Date;
    setDateFrom(dateFrom: Date | null): void;
    dateTo: Date;
    setDateTo(dateTo: Date | null): void;
    transmissionDatesFilter?: Date[];
    customerIdsFilter?: Customer[];
    setCustomerIdsFilter(customers: Customer[], changeReason: string): void;
    productIdsFilter?: Product[];
    setProductIdsFilter(products: Product[], changeReason: string): void;
}

export class TransactionController implements ITransactionStore {
    constructor() {
        this.setDefault();
        makeAutoObservable(this);
        this.getServerFilteredData();
    }

    async getServerFilteredData(): Promise<void> {
        const result: AxiosResponse<[Transaction[], Customer[], Product[]]> = await TransactionService.getTransactionByDate(this.dateFrom, this.dateTo);
        [this.serverFilteredTransactions, this.serverFilteredCustomers, this.serverFilteredProducts] = result.data;
        this.applyLocalFilter();
        this.updateCustomerDropdownList();
        this.updateProductDropdownList();
    }

    setDateFrom(dateFrom: Date): void {
        this.dateFrom = dateFrom;
        this.getServerFilteredData();
    }

    setDateTo(dateTo: Date): void {
        this.dateTo = dateTo;
        this.getServerFilteredData();
    }

    setProductIdsFilter = (products: Product[] | [], changeReason: string): void => {
        this.productIdsFilter = products;
        this.applyLocalFilter();
        this.updateCustomerDropdownList();
        //if (changeReason === 'remove-option') {
            this.updateProductDropdownList();
        //}
    };

    setCustomerIdsFilter = (customers: Customer[] | [], changeReason: string): void => {
        this.customerIdsFilter = customers;
        this.applyLocalFilter();
        this.updateProductDropdownList();
        //if (changeReason === 'remove-option') {
            this.updateCustomerDropdownList();
        //}
    };

    applyLocalFilter = (): void => {
        this.localFilteredTransactions = this.serverFilteredTransactions?.filter((x) => {
            // eslint-disable-next-line no-nested-ternary
            const isValidCustomerFilter = this.customerIdsFilter !== undefined && this.customerIdsFilter !== null && this.customerIdsFilter.length !== 0;
            const isValidProductFilter = this.productIdsFilter !== undefined && this.productIdsFilter !== null && this.productIdsFilter.length !== 0;
            return (
                (isValidCustomerFilter ? this.customerIdsFilter?.map((customer) => customer.ID).includes(x.CUSTOMER_ID) : true) &&
                (isValidProductFilter ? this.productIdsFilter?.map((product) => product.ID).includes(x.PRODUCT_ID) : true)
            );
        });
    };

    updateCustomerDropdownList2 = (): void => {
        const filteredCustomerIds = this.localFilteredTransactions?.map((x) => x.CUSTOMER_ID);
        const uniqueFilteredCustomerIds = filteredCustomerIds?.filter((x, i, a) => a.indexOf(x) === i);
        this.localFilteredCustomers = this.serverFilteredCustomers?.filter((customer) => uniqueFilteredCustomerIds?.includes(customer.ID));
    };

    updateCustomerDropdownList = (): void => {
        const isValidProductFilter = this.productIdsFilter !== undefined && this.productIdsFilter !== null && this.productIdsFilter.length !== 0;
        if (isValidProductFilter) {
            const filteredCustomerIds = this.serverFilteredTransactions
                ?.filter((transaction) => this.productIdsFilter?.map((product) => product.ID).includes(transaction.PRODUCT_ID))
                .map((transaction) => transaction.CUSTOMER_ID);
            const uniqueFilteredCustomerIds = filteredCustomerIds?.filter((x, i, a) => a.indexOf(x) === i);
            this.localFilteredCustomers = this.serverFilteredCustomers?.filter((customer) => uniqueFilteredCustomerIds?.includes(customer.ID));
        } else {
            this.localFilteredCustomers = this.serverFilteredCustomers;
        }
    };

    updateProductDropdownList2 = (): void => {
        const filteredProductIds = this.localFilteredTransactions?.map((x) => x.PRODUCT_ID);
        const uniqueFilteredProductIds = filteredProductIds?.filter((x, i, a) => a.indexOf(x) === i);
        this.localFilteredProducts = this.serverFilteredProducts?.filter((product) => uniqueFilteredProductIds?.includes(product.ID));
    };

    updateProductDropdownList = (): void => {
        const isValidCustomerFilter = this.customerIdsFilter !== undefined && this.customerIdsFilter !== null && this.customerIdsFilter.length !== 0;
        if (isValidCustomerFilter) {
            const filteredProductIds = this.serverFilteredTransactions
                ?.filter((transaction) => this.customerIdsFilter?.map((customer) => customer.ID).includes(transaction.CUSTOMER_ID))
                .map((transaction) => transaction.PRODUCT_ID);
            const uniqueFilteredProductIds = filteredProductIds?.filter((x, i, a) => a.indexOf(x) === i);
            this.localFilteredProducts = this.serverFilteredProducts?.filter((product) => uniqueFilteredProductIds?.includes(product.ID));
        } else {
            this.localFilteredProducts = this.serverFilteredProducts;
        }
    };

    serverFilteredTransactions?: Transaction[];

    localFilteredTransactions?: Transaction[];

    serverFilteredCustomers?: Customer[];

    localFilteredCustomers?: Customer[];

    serverFilteredProducts?: Product[];

    localFilteredProducts?: Product[];

    dateFrom!: Date;

    dateTo!: Date;

    transmissionDatesFilter?: Date[];

    customerIdsFilter?: Customer[];

    productIdsFilter?: Product[];

    private setDefault(): void {
        const today = new Date();
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        this.dateFrom = monthAgo;
        this.dateTo = today;
    }
}

export default createContext<ITransactionStore>(new TransactionController());
