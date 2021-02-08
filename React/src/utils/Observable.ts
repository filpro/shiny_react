import IObserver from './IObserver';

/** This very basic Observer/Observable design pattern implementation is primarily dedicated to inform Mobx stores about API links
 * sent from Shiny to React, so that services knows when to start consume it. */
export default abstract class Observable {
    observers: IObserver[] = [];

    addObserver = (observer: IObserver): void => {
        this.observers.push(observer);
    };

    notifyObservers = (): void => {
        this.observers.forEach((observer) => observer.update());
    };
}
