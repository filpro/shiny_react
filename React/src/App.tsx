import React from 'react';
import './App.css';
import Card from '@material-ui/core/Card/Card';
import { hot } from 'react-hot-loader';
import { CardContent, Typography, CardActions, Button } from '@material-ui/core';
import IWindow from './utils/IWindow';

declare let window: IWindow;

interface IState {
    apiUrl: string;
}

class App extends React.Component<unknown, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            apiUrl: '',
        };
    }

    componentDidMount() {
        window.Shiny.addCustomMessageHandler('test', (data: any) => {
            console.log(data);
        });

        window.Shiny.addCustomMessageHandler('urlPath', (url: string) => {
            this.setState({ apiUrl: url });
        });

        $(document).on('shiny:connected', () => console.log(`Session initialized: ${Date()}`));
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Get an API: {this.state.apiUrl}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card>
                </header>
            </div>
        );
    }
}

export default hot(module)(App);
