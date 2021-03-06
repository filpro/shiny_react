import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import Customer from '../models/Customer';
import Observable from '../utils/Observable';

export interface CustomerApi {
    customerApiAddNew: string;
    customerApiGetAll: string;
    customerApiGetById: string;
}

class CustomerService extends Observable {
    apiUrls?: CustomerApi;

    serviceReady = false;

    /** Sets an API for managing customers */
    setApiUrl(urls: CustomerApi) {
        this.apiUrls = urls;
        this.serviceReady = true;
        this.notifyObservers();
    }

    saveCustomer = async (customer: Customer): Promise<AxiosResponse<Customer>> => {
        const result = await axios.post(this.apiUrls!.customerApiAddNew, customer).catch((error) => error.response);
        return result;
    };

    getAllCustomers = async (): Promise<AxiosResponse<Customer[]>> => {
        const result = await axios.get<Customer[], AxiosResponse<Customer[]>>(this.apiUrls!.customerApiGetAll).catch((error) => error.response);
        return result;
    };

    async getCustomerById(ids: string): Promise<AxiosResponse<Customer>>;

    async getCustomerById(ids: string[]): Promise<AxiosResponse<Customer[]>>;

    async getCustomerById(ids: string | string[]): Promise<AxiosResponse<Customer> | AxiosResponse<Customer[]>> {
        if (Array.isArray(ids)) {
            const result = await axios
                .get(this.apiUrls!.customerApiGetById, {
                    params: {
                        ids,
                    },
                    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
                })
                .catch((error) => error.response);
            return result;
        }

        const result = await axios
            .get(this.apiUrls!.customerApiGetById, {
                params: {
                    ids,
                },
            })
            .catch((error) => error.response);
        return result;
    }
}

export default new CustomerService();
