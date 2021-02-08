import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import { TranslateItem } from '../Translations';
import Language from '../enums/Language';
import TranslationsStore from '../Translations.Store';
import Translate from '../Translate';

export interface WithTranslateProps {
    lang: Language;
    translate: (item: TranslateItem) => string;
}

const withTranslate = <P extends WithTranslateProps = WithTranslateProps>(
    Component: React.ComponentType<P>
): React.ComponentType<Omit<P, keyof WithTranslateProps>> => {
    return observer((props: Omit<P, keyof WithTranslateProps>) => {
        const translationCtx = useContext(TranslationsStore);

        return <Component {...(props as P)} lang={translationCtx.Language} translate={(item: TranslateItem) => Translate(item, translationCtx.Language)} />;
    });
};

export default withTranslate;
