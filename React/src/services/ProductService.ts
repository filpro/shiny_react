import axios, { AxiosResponse } from 'axios';
import Product from '../models/Product';

export interface ProductApi {
    productApiAddNew: string;
}

class ProductService {
    apiUrls?: ProductApi;

    setApiUrl(urls: ProductApi) {
        this.apiUrls = urls;
    }

    async saveProduct(product: Product): Promise<AxiosResponse<Product>> {
        const result = await axios.post(this.apiUrls!.productApiAddNew, product).catch((error) => error.response);
        return result;
    }
}

export default new ProductService();
