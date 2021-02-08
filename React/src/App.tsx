import React, { useEffect, useState } from 'react';
import './App.css';
import { hot } from 'react-hot-loader';
import LinearProgress from '@material-ui/core/LinearProgress';
import { observer } from 'mobx-react';
import AppRouter from './components/Router/AppRouter';
import Sidebar from './components/Sidebar/Sidebar';
import CustomerService, { CustomerApi } from './services/CustomerService';
import TransactionService, { TransactionApi } from './services/TransactionService';
import IWindow from './utils/IWindow';
import ProductService, { ProductApi } from './services/ProductService';
import UpdateTrigger from './components/UpdateTrigger/UpdateTrigger';
import withTranslate from './infrastructure/internationalization/hoc/WithTranslate';

declare let window: IWindow;

const App: React.FC = observer(
    (): JSX.Element => {
        const [isInitialized, setIsInitialized] = useState(false);
        const [isCustomerApiLoaded, setIsCustomerApiLoaded] = useState(false);
        const [isTransactionApiLoaded, setIsTransactionApiLoaded] = useState(false);
        const [isProductApiLoaded, setIsProductApiLoaded] = useState(false);
        const [isShinyConnected, setIsShinyConnected] = useState(false);
        const [progress, setProgress] = useState(0);

        useEffect(() => {
            window.Shiny.addCustomMessageHandler<CustomerApi>('customerApi', (urls: CustomerApi) => {
                CustomerService.setApiUrl(urls);
                setIsCustomerApiLoaded(true);
            });

            window.Shiny.addCustomMessageHandler<TransactionApi>('transactionApi', (urls: TransactionApi) => {
                TransactionService.setApiUrl(urls);
                setIsTransactionApiLoaded(true);
            });

            window.Shiny.addCustomMessageHandler<ProductApi>('productApi', (urls: ProductApi) => {
                ProductService.setApiUrl(urls);
                setIsProductApiLoaded(true);
            });

            $(document).on('shiny:connected', () => {
                setIsShinyConnected(true);
                console.log(`Session initialized: ${Date()}`);
            });

            const loadChecker: boolean[] = [isShinyConnected, isCustomerApiLoaded, isTransactionApiLoaded, isProductApiLoaded];
            if (loadChecker.every((check: boolean) => check)) {
                setIsInitialized(true);
            }

            setProgress((loadChecker.filter((x) => x).length / loadChecker.length) * 100);
        }, [isShinyConnected, isCustomerApiLoaded, isTransactionApiLoaded, isProductApiLoaded]);

        const appContent: JSX.Element = (
            <header className="App-header">
                <UpdateTrigger />
                <Sidebar>{isInitialized ? <AppRouter /> : <LinearProgress variant="determinate" value={progress} />}</Sidebar>
            </header>
        );

        return <div className="App">{appContent}</div>;
    }
);

export default hot(module)(withTranslate(App));
