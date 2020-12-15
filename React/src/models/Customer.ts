export default class Customer {
    ID: string;

    FIRST_NAME: string;

    DATE_CREATED?: Date;

    IS_DELETED?: boolean;

    DATE_MODIFIED?: Date;

    AUTHOR?: string;

    LAST_NAME: string;

    constructor(id: string, firstName: string, lastName: string) {
        this.ID = id;
        this.FIRST_NAME = firstName;
        this.LAST_NAME = lastName;
    }
}
