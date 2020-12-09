import React, { useEffect, useState } from 'react';
import './App.css';
import { hot } from 'react-hot-loader';
import { Grid, createStyles, makeStyles, Theme, Container, Paper } from '@material-ui/core';
import IWindow from './utils/IWindow';
import Mtcars from './models/Mtcars';
import Sidebar from './components/Sidebar/Sidebar';
import AppRouter from './components/Router/AppRouter';
import ShinyContext from './context/ShinyContext';
import UserService from './services/UserService';
import User from './models/User';

declare let window: IWindow;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        gridcontainer: {
            maxWidth: window.innerWidth * 0.93,
            wordWrap: 'break-word',
            gridGap: theme.spacing(3),
        },
        paper: {
            margin: `${theme.spacing(2)}px auto`,
            padding: theme.spacing(2),
        },
    })
);

const App: React.FC = (): JSX.Element => {
    const [apiUrl, setApiUrl] = useState('session has not been initialized yet');
    const [valApiUrl, setValApiUrl] = useState('');
    const [userApiUrl, setUserApiUrl] = useState('');
    const [mtcars, setMtcars] = useState<Mtcars[]>([]);
    const [seconds, setSeconds] = useState(0);
    const [value, setValue] = useState(0);

    const classes = useStyles();

    useEffect(() => {
        window.Shiny.addCustomMessageHandler<Mtcars[]>('test', (data: Mtcars[]) => {
            setMtcars(data);
        });

        window.Shiny.addCustomMessageHandler<string>('urlPath', (url: string) => {
            setApiUrl(url);
        });

        window.Shiny.addCustomMessageHandler<string>('valUrlPath', (url: string) => {
            setValApiUrl(url);
        });

        window.Shiny.addCustomMessageHandler<string>('userApi', (url: string) => {
            setUserApiUrl(url);
            UserService.setApiUrl(url);
        });

        window.Shiny.addCustomMessageHandler<number>('sessionDuration', (duration: number) => {
            setSeconds(duration);
        });

        $(document).on('shiny:connected', () => {
            console.log(`Session initialized: ${Date()}`);
        });
    });

    const handleClickRandom = async () => {
        const result: number = await fetch(valApiUrl).then((response) => response.json());
        setValue(result);
    };

    const contextValue = {
        apiUrl,
        valApiUrl,
        userApiUrl,
        seconds,
        value,
        mtcars,
        handleClickRandom,
    };

    return (
        <div className="App">
            <header className="App-header">
                <ShinyContext.Provider value={contextValue}>
                    <Sidebar>
                        <Container className={classes.gridcontainer}>
                            <Paper className={classes.paper}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <AppRouter />
                                </Grid>
                            </Paper>
                        </Container>
                    </Sidebar>
                </ShinyContext.Provider>
            </header>
        </div>
    );
};

export default hot(module)(App);
