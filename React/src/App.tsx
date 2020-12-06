import React, { useEffect, useState } from 'react';
import './App.css';
import { hot } from 'react-hot-loader';
import { Typography, Button, Grid, createStyles, makeStyles, Theme, Container, Paper } from '@material-ui/core';
import IWindow from './utils/IWindow';
import Mtcars from './models/Mtcars';
import DenseTable from './components/Mytable';
import Sidebar from './components/Sidebar/Sidebar';
import AppRouter from './components/Router/AppRouter'
import {BrowserRouter as Router} from 'react-router-dom';

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
    const [mtcars, setMtcars] = useState<Mtcars[]>([]);
    const [learnMore, setLearnMore] = useState(true);
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
            console.log(url);
            setValApiUrl(url);
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

    let table: JSX.Element;
    if (learnMore) {
        table = <DenseTable data={mtcars} />;
    } else {
        table = <></>;
    }

    return (
        <div className="App">
            <header className="App-header">
                <Sidebar>
                    <Container className={classes.gridcontainer}>
                        <Paper className={classes.paper}>
                            <Grid item>
                                <Typography color="textSecondary" gutterBottom>
                                    {`Geets an API: ${apiUrl} - ${seconds} - ${value}`}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    {`Get an API: ${valApiUrl} - ${seconds} - ${value}`}
                                </Typography>
                                <Button size="small" onClick={() => setLearnMore(!learnMore)}>
                                    Learn more
                                </Button>
                                <Button size="small" onClick={() => handleClickRandom()}>
                                    Get random
                                </Button>
                            </Grid>
                        </Paper>
                        <Paper className={classes.paper}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                {table}
                            </Grid>
                        </Paper>
                        <Paper className={classes.paper}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <AppRouter/>
                            </Grid>
                        </Paper>
                    </Container>
                </Sidebar>
            </header>
        </div>
    );
};

export default hot(module)(App);
