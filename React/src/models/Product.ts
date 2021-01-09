class Product {
    ID?: string;

    PRODUCT_NAME: string;

    DATE_CREATED?: Date;

    IS_DELETED?: boolean;

    DATE_MODIFIED?: Date;

    AUTHOR?: string;

    constructor(PRODUCT_NAME: string, ID?: string, IS_DELETED?: boolean, DATE_CREATED?: Date, DATE_MODIFIED?: Date, AUTHOR?: string) {
        this.ID = ID;
        this.PRODUCT_NAME = PRODUCT_NAME;
        this.DATE_CREATED = DATE_CREATED;
        this.IS_DELETED = IS_DELETED;
        this.DATE_MODIFIED = DATE_MODIFIED;
        this.AUTHOR = AUTHOR;
    }
}

export default Product;
