export interface TranslateItem {
    pl: string;
    en: string;
    comment?: string;
}

export type ITranslations = {
    [propName: string]: TranslateItem | ITranslations;
};

const Translations = {
    Sidebar: {
        Transactions: { pl: 'Transakcje', en: 'Transactions' },
        Search: { pl: 'Wyszukaj', en: 'Search' },
    },
    NewTransaction: {
        TransmissionDate: { pl: 'Data transmisji', en: 'Transmission date' },
        ProductNumber: { pl: 'Numer produktu', en: 'Product number' },
        ClientName: { pl: 'Nazwa klienta', en: 'Client name' },
        ProductPrice: { pl: 'Cena produktu', en: 'Product price' },
        Sold: { pl: 'SPRZEDANO', en: 'SOLD' },
        ProductExistsWarning: { pl: 'Podany numer produktu już istnieje dla tej daty', en: 'Such product number already exists for given date' },
        AddNewCustomer: { pl: 'Dodaj nowego klienta', en: 'Add new customer' },
        NewClient: {
            AddNewClient: { pl: 'Dodaj nowego klienta', en: 'Add new customer' },
            FirstName: { pl: 'Imię', en: 'First name' },
            LastName: { pl: 'Nazwisko', en: 'Last name' },
            Cancel: { pl: 'Anuluj', en: 'Cancel' },
            Add: { pl: 'Dodaj', en: 'Add' },
        },
        TransactionConfirmation: {
            TransactionDate: { pl: 'Data transakcji', en: 'Transaction date' },
            ProductName: { pl: 'Nazwa produktu', en: 'Product name' },
            CustomerName: { pl: 'Nazwa klienta', en: 'Customer name' },
            ProductPrice: { pl: 'Cena prodktu', en: 'Product price' },
            Title: { pl: 'Rejestracja transakcji', en: 'Register new transaction' },
            Cancel: { pl: 'Anuluj', en: 'Cancel' },
            Confirm: { pl: 'Potwierdź', en: 'Confirm' },
        },
    },
    SearchTransaction: {
        Filters: {
            Filters: { pl: 'FILTRY', en: 'FILTERS' },
            DateFrom: { pl: 'Od', en: 'From' },
            DateTo: { pl: 'Do', en: 'To' },
            TransmissionDate: { pl: 'Data transmisji', en: 'Transmission date' },
            CustomerName: { pl: 'Nazwa klienta', en: 'Customer name' },
            ProductName: { pl: 'Numer produktu', en: 'Product name' },
            NoMoreOptions: { pl: 'Brak możliwych opcji', en: 'No option available' },
        },
        Summary: {
            Summary: { pl: 'PODSUMOWANIE', en: 'SUMMARY' },
            TransmissionsCount: { pl: 'Liczba transmisji', en: 'No of transmissions' },
            TransactionsCount: { pl: 'Liczba transakcji', en: 'No of transactions' },
            CustomersCount: { pl: 'Liczba klientów', en: 'No of customers' },
            TurnoverSum: { pl: 'Obrót', en: 'Turnover' },
        },
        TransactionsList: {
            TransactionsList: { pl: 'LISTA TRANSAKCJI', en: 'LIST OF TRANSACTIONS' },
            MarkAs: { pl: 'Oznacz jako', en: 'Mark as' },
            Sent: { pl: 'wysłane', en: 'sent' },
            Unsent: { pl: 'niewysłane', en: 'not sent' },
            Paid: { pl: 'opłaone', en: 'paid' },
            Unpaid: { pl: 'nieopłacone', en: 'not paid' },
            Delete: { pl: 'usuń', en: 'delete' },
            DeleteConfirmation: {
                Title: { pl: 'Usunięcie transakcji', en: 'Remove transaction' },
                Description: { pl: 'Czy na pewno chcesz usunąć ', en: 'Do you really want to remove ' },
                Yes: { pl: 'Tak, kasuję', en: 'Yes, I do' },
                No: { pl: 'Nie', en: 'No' },
            },
        },
    },
};

const testAndExportTranslations = (translations: ITranslations): typeof Translations => {
    return translations as typeof Translations;
};

export default testAndExportTranslations(Translations);
