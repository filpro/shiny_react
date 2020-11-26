import React, { useState, useEffect } from 'react';
import './App.css';
import Card from '@material-ui/core/Card/Card';
import { hot } from 'react-hot-loader';

declare let window: IWindow

interface Shiny {
  addCustomMessageHandler(name: string, callback: (n: any) => any): void
  setInputValue(name: string, obj: any): void
}


interface IWindow extends Window {
  Shiny: Shiny
}

class App extends React.Component<unknown, unknown> {

  constructor(props: any) {
    super(props)
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    //$(document).on('shiny:connected', () => {
      //this.setInputValues()
    //})
    $(document).on('shiny:connected', () => {
      this.setInputValues()
    })

    window.Shiny.addCustomMessageHandler('test', (data) => {
      console.log(data);
    })
    
  
  }

  componentDidUpdate() {
    this.setInputValues()
  }

  setInputValues() {
    window.Shiny.setInputValue('bins', Date())
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Card>
            Dupaaaa!
        </Card>
        </header>
      </div>
    );
  }
}

export default hot(module)(App);
