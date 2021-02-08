import Language from './enums/Language';
import { TranslateItem } from './Translations';

const Translate = (translateItem: TranslateItem, language: Language): string => {
    const result = translateItem[language];
    if (result === undefined) {
        return translateItem.pl;
    }

    return result;
};

export default Translate;
