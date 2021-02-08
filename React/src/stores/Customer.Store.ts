import { AxiosResponse } from 'axios';
import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import Customer from '../models/Customer';
import CustomerService from '../services/CustomerService';
import IObserver from '../utils/IObserver';

interface ICustomerStore {
    getCustomerById(id: string): Promise<void>;
    loadAllCustomers(): Promise<void>;
    addCustomer(customer: Customer): Promise<void>;
    setSelected(customer: Customer | null): void;
    allCustomers?: Customer[];
    selectedCustomer?: Customer | null;
    isFetchSucceed?: boolean;
    httpStatus?: number;
    isLoading: boolean;
}

export class CustomerController implements ICustomerStore, IObserver {
    constructor() {
        CustomerService.addObserver(this);
        if (CustomerService.serviceReady) this.setup();
    }

    update(): void {
        if (CustomerService.serviceReady) this.setup();
    }

    private setup(): void {
        this.loadAllCustomers();
        makeAutoObservable(this);
    }

    async addCustomer(customer: Customer): Promise<void> {
        const newCustomer: AxiosResponse<Customer> = await CustomerService.saveCustomer(customer);
        this.loadAllCustomers();
        this.selectedCustomer = newCustomer.data;
    }

    async loadAllCustomers(): Promise<void> {
        this.isLoading = true;
        const serverResponse: AxiosResponse<Customer[]> = await CustomerService.getAllCustomers();
        const response = serverResponse;
        this.allCustomers = response.data;
        this.isLoading = false;
    }

    async getCustomerById(id: string): Promise<void> {
        const serverResponse: AxiosResponse<Customer> = await CustomerService.getCustomerById(id);
        this.selectedCustomer = serverResponse.data;
    }

    setSelected(customer: Customer | null): void {
        this.selectedCustomer = customer;
    }

    isLoading = false;

    selectedCustomer?: Customer | null;

    allCustomers?: Customer[];

    isFetchSucceed?: boolean | undefined;

    httpStatus?: number | undefined;
}

export default createContext<ICustomerStore>(new CustomerController());
