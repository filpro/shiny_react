export default class Transaction {
    ID?: string;

    CUSTOMER_ID: string;

    PRODUCT_ID?: string;

    TRANSMISSION_ID: Date;

    PRODUCT_PRICE: number;

    IS_PAID?: boolean;

    IS_DELIVERED?: boolean;

    DATE_CREATED?: Date;

    IS_DELETED?: boolean;

    DATE_MODIFIED?: Date;

    AUTHOR?: string;

    constructor(customerId: string, transmissionId: string, productPrice: number) {
        this.CUSTOMER_ID = customerId;
        this.TRANSMISSION_ID = transmissionId;
        this.PRODUCT_PRICE = productPrice;
    }
}
