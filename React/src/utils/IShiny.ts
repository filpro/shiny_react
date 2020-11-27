export default interface IShiny {
    addCustomMessageHandler(name: string, callback: (n: any) => any): void;
    setInputValue(name: string, obj: any): void;
}
