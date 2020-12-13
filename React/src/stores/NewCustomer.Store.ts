import { AxiosResponse } from 'axios';
import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import Customer from '../models/Customer';
import CustomerService from '../services/CustomerService';

interface ICustomerStore {
    getCustomerById(id: string): Promise<void>;
    newCustomer?: Customer;
    isFetchSucceed?: boolean;
    httpStatus?: number;
}

export class CustomerController implements ICustomerStore {
    constructor() {
        makeAutoObservable(this);
    }

    async addCustomer(firstName: string, lastName: string): Promise<void> {
        const newCustomer: Customer = await CustomerService.saveCustomer(new Customer('TESTID', firstName, lastName));
        this.newCustomer = newCustomer;
    }

    async getAllCustomers(): Promise<void> {
        const serverResponse: AxiosResponse<Customer[]> = await CustomerService.getAllCustomers();
        this.allCustomers = serverResponse.data;
    }

    allCustomers?: Customer[];

    newCustomer?: Customer;

    isFetchSucceed?: boolean | undefined;

    httpStatus?: number | undefined;
}

export default createContext<ICustomerStore>(new CustomerController());
