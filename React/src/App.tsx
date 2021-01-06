import React, { useEffect, useState } from 'react';
import './App.css';
import { hot } from 'react-hot-loader';
import { Grid, createStyles, makeStyles, Theme, Container, Paper } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import AppRouter from './components/Router/AppRouter';
import Sidebar from './components/Sidebar/Sidebar';
import CustomerService, { CustomerApi } from './services/CustomerService';
import TransactionService, { TransactionApi } from './services/TransactionService';
import IWindow from './utils/IWindow';

declare let window: IWindow;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        gridcontainer: {
            maxWidth: window.innerWidth * 0.93,
            wordWrap: 'break-word',
            gridGap: theme.spacing(3),
        },
    })
);

const App: React.FC = (): JSX.Element => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isCustomerApiLoaded, setIsCustomerApiLoaded] = useState(false);
    const [isTransactionApiLoaded, setIsTransactionApiLoaded] = useState(false);
    const [isShinyConnected, setIsShinyConnected] = useState(false);
    const [progress, setProgress] = useState(0);

    const classes = useStyles();

    useEffect(() => {
        window.Shiny.addCustomMessageHandler<CustomerApi>('customerApi', (urls: CustomerApi) => {
            CustomerService.setApiUrl(urls);
            setIsCustomerApiLoaded(true);
        });

        window.Shiny.addCustomMessageHandler<TransactionApi>('transactionApi', (urls: TransactionApi) => {
            TransactionService.setApiUrl(urls);
            setIsTransactionApiLoaded(true);
        });

        $(document).on('shiny:connected', () => {
            setIsShinyConnected(true);
            console.log(`Session initialized: ${Date()}`);
        });

        const loadChecker: boolean[] = [isShinyConnected, isCustomerApiLoaded, isTransactionApiLoaded];
        if (loadChecker.every((check: boolean) => check)) {
            setIsInitialized(true);
        }

        setProgress((loadChecker.filter((x) => x).length / loadChecker.length) * 100);
    }, [isShinyConnected, isCustomerApiLoaded, isTransactionApiLoaded]);

    const appContent: JSX.Element = (
        <header className="App-header">
            <Sidebar>
                <Container className={classes.gridcontainer}>
                    {isInitialized ? <AppRouter /> : <LinearProgress variant="determinate" value={progress} />}
                </Container>
            </Sidebar>
        </header>
    );

    return <div className="App">{appContent}</div>;
};

export default hot(module)(App);
