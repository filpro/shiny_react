import { AxiosResponse } from 'axios';
import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import Customer from '../models/Customer';
import CustomerService from '../services/CustomerService';

interface ICustomerStore {
    getCustomerById(id: string): Promise<void>;
    loadAllCustomers(): Promise<void>;
    addCustomer(customer: Customer): Promise<void>;
    setSelected(customer: Customer): void;
    allCustomers?: Customer[];
    selectedCustomer?: Customer;
    isFetchSucceed?: boolean;
    httpStatus?: number;
}

export class CustomerController implements ICustomerStore {
    constructor() {
        if (CustomerService.serviceReady) this.loadAllCustomers();
        makeAutoObservable(this);
    }

    async addCustomer(customer: Customer): Promise<void> {
        const newCustomer: AxiosResponse<Customer> = await CustomerService.saveCustomer(customer);
        this.loadAllCustomers();
        this.selectedCustomer = newCustomer.data;
    }

    async loadAllCustomers(): Promise<void> {
        const serverResponse: AxiosResponse<Customer[]> = await CustomerService.getAllCustomers();
        const response = serverResponse;
        this.allCustomers = response.data;
    }

    async getCustomerById(id: string): Promise<void> {
        const serverResponse: AxiosResponse<Customer> = await CustomerService.getCustomerById(id);
        this.selectedCustomer = serverResponse.data;
    }

    setSelected(customer: Customer): void {
        this.selectedCustomer = customer;
    }

    selectedCustomer?: Customer;

    allCustomers?: Customer[];

    isFetchSucceed?: boolean | undefined;

    httpStatus?: number | undefined;
}

export default createContext<ICustomerStore>(new CustomerController());
