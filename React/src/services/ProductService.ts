import axios, { AxiosResponse, CancelTokenStatic, CancelTokenSource } from 'axios';
import Product from '../models/Product';
import Observable from '../utils/Observable';

export interface ProductApi {
    productApiAddNew: string;
    productApiCheckIfExistsTransaction: string;
}

class ProductService extends Observable {
    apiUrls?: ProductApi;

    cancelToken?: CancelTokenStatic;

    source?: CancelTokenSource;

    setApiUrl(urls: ProductApi) {
        this.apiUrls = urls;
        this.notifyObservers();
    }

    async saveProduct(product: Product): Promise<AxiosResponse<Product>> {
        const result = await axios.post(this.apiUrls!.productApiAddNew, product).catch((error) => error.response);
        return result;
    }

    async checkIfExistsTransaction(productName: string, transactionDate: Date): Promise<AxiosResponse<boolean>> {
        if (this.source !== undefined) {
            this.source.cancel('Operation canceled due to new request.');
        }

        this.cancelToken = axios.CancelToken;
        this.source = this.cancelToken.source();

        const result = await axios
            .get(this.apiUrls!.productApiCheckIfExistsTransaction, {
                params: {
                    productName,
                    transactionDate,
                },
                cancelToken: this.source.token,
            })
            .catch((error) => error.response);
        return result;
    }
}

export default new ProductService();
