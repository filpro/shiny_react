import React, { useEffect, useState } from 'react';
import './App.css';
import Card from '@material-ui/core/Card/Card';
import { hot } from 'react-hot-loader';
import { CardContent, Typography, CardActions, Button } from '@material-ui/core';
import IWindow from './utils/IWindow';
import Mtcars from './models/Mtcars';
import DenseTable from './components/Mytable';

declare let window: IWindow;

const App: React.FC = (): JSX.Element => {
    const [apiUrl, setApiUrl] = useState('session has not been initialized yet');
    const [mtcars, setMtcars] = useState<Mtcars[]>([]);
    const [learnMore, setLearnMore] = useState(true);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        window.Shiny.addCustomMessageHandler<Mtcars[]>('test', (data: Mtcars[]) => {
            setMtcars(data);
        });

        window.Shiny.addCustomMessageHandler<string>('urlPath', (url: string) => {
            setApiUrl(url);
        });

        window.Shiny.addCustomMessageHandler<number>('sessionDuration', (seconds: number) => {
            setSeconds(seconds);
        });

        $(document).on('shiny:connected', () => {
            console.log(`Session initialized: ${Date()}`)
        });
    });



    let table: JSX.Element;
    if (learnMore) {
        table = <DenseTable data={mtcars} />;
    } else {
        table = <></>;
    }

    return (
        <div className="App">
            <header className="App-header">
                <Card>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            Get an API: {apiUrl} + ' ' + {seconds}
                        </Typography>
                        
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={() => setLearnMore(!learnMore)}>
                            Learn More
                        </Button>
                    </CardActions>
                </Card>
                <Card>
                    <CardContent>{table}</CardContent>
                </Card>
            </header>
        </div>
    );
};

export default hot(module)(App);
