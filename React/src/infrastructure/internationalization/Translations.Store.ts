import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import Language from './enums/Language';

interface ITranslationStore {
    Language: Language;
    setLanguage(value: Language): void;
}

const defaultLanguage = Language.pl;

export class TranslationController implements ITranslationStore {
    currentLanguage: Language;

    constructor() {
        this.currentLanguage = defaultLanguage;
        makeAutoObservable(this);
    }

    get Language(): Language {
        return this.currentLanguage;
    }

    setLanguage(value: Language): void {
        this.currentLanguage = value;
    }
}

export default createContext<ITranslationStore>(new TranslationController());
