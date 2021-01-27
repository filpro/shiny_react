import IObserver from './IObserver';

export default abstract class Observable {
    observers: IObserver[] = [];

    addObserver = (observer: IObserver): void => {
        this.observers.push(observer);
    };

    notifyObservers = (): void => {
        this.observers.forEach((observer) => observer.update());
    };
}
