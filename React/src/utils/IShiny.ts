export default interface IShiny {
    addCustomMessageHandler<T>(name: string, callback: (n: T) => void): void;
    setInputValue<T>(name: string, obj: T): void;
}
