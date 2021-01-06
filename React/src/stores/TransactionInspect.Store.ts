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
    dateFrom?: Date;
    setDateFrom(dateFrom: Date | null): void;
    dateTo?: Date;
    setDateTo(dateTo: Date | null): void;
    transmissionDatesFilter?: Date[];
    customerIdsFilter?: Customer[];
    setCustomerIdsFilter(customers: Customer[]): void;
    productIdsFilter?: Product[];
    setProductIdsFilter(products: Product[]): void;
}

export class TransactionController implements ITransactionStore {
    constructor() {
        makeAutoObservable(this);
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

    setProductIdsFilter = (products: Product[] | []): void => {
        this.productIdsFilter = products;
        this.applyLocalFilter();
        this.updateCustomerDropdownList();
    };

    setCustomerIdsFilter = (customers: Customer[] | []): void => {
        this.customerIdsFilter = customers;
        this.applyLocalFilter();
        this.updateProductDropdownList();
    };

    applyLocalFilter = (): void => {
        this.localFilteredTransactions = this.serverFilteredTransactions?.filter((x) => {
            // eslint-disable-next-line no-nested-ternary
            return (
                (this.customerIdsFilter !== undefined && this.customerIdsFilter !== null && this.customerIdsFilter.length !== 0
                    ? this.customerIdsFilter?.map((customer) => customer.ID).includes(x.CUSTOMER_ID)
                    : true) &&
                (this.productIdsFilter !== undefined && this.productIdsFilter !== null && this.productIdsFilter.length !== 0
                    ? this.productIdsFilter?.map((product) => product.ID).includes(x.PRODUCT_ID)
                    : true)
            );
        });
    };

    updateCustomerDropdownList = (): void => {
        const filteredCustomerIds = this.localFilteredTransactions?.map((x) => x.CUSTOMER_ID);
        const uniqueFilteredCustomerIds = filteredCustomerIds?.filter((x, i, a) => a.indexOf(x) === i);
        this.localFilteredCustomers = this.serverFilteredCustomers?.filter((customer) => uniqueFilteredCustomerIds?.includes(customer.ID));
    };

    updateProductDropdownList = (): void => {
        const filteredProductIds = this.localFilteredTransactions?.map((x) => x.PRODUCT_ID);
        const uniqueFilteredProductIds = filteredProductIds?.filter((x, i, a) => a.indexOf(x) === i);
        this.localFilteredProducts = this.serverFilteredProducts?.filter((product) => uniqueFilteredProductIds?.includes(product.ID));
    };

    serverFilteredTransactions?: Transaction[];

    localFilteredTransactions?: Transaction[];

    serverFilteredCustomers?: Customer[];

    localFilteredCustomers?: Customer[];

    serverFilteredProducts?: Product[];

    localFilteredProducts?: Product[];

    dateFrom?: Date;

    dateTo?: Date;

    transmissionDatesFilter?: Date[];

    customerIdsFilter?: Customer[];

    productIdsFilter?: Product[];
}

export default createContext<ITransactionStore>(new TransactionController());
