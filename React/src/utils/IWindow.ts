import Shiny from './IShiny';

export default interface IWindow extends Window {
    Shiny: Shiny;
}
