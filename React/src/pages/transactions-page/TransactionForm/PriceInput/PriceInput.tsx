import React from 'react';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import { InputAdornment } from '@material-ui/core';
import withTranslate, { WithTranslateProps } from '../../../../infrastructure/internationalization/hoc/WithTranslate';
import Translations from '../../../../infrastructure/internationalization/Translations';

interface NumberFormatCustomProps {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const NumberFormatCustom = (props: NumberFormatCustomProps) => {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            allowNegative={false}
            decimalScale={2}
            allowLeadingZeros
            fixedDecimalScale
            allowedDecimalSeparators={['.', ',']}
        />
    );
};

interface State {
    numberformat: string;
}

interface IProps {
    productPrice: string;
    handleProductPriceChange(price: string): void;
}

const PriceInput: React.FC<IProps & WithTranslateProps> = (props: IProps & WithTranslateProps): JSX.Element => {
    const [values, setValues] = React.useState<State>({
        numberformat: props.productPrice,
    });
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.handleProductPriceChange(event.target.value);
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });
    };
    return (
        <TextField
            autoComplete="off"
            label={props.translate(Translations.NewTransaction.ProductPrice)}
            value={props.productPrice}
            onChange={handleChange}
            name="numberformat"
            id="formatted-numberformat-input"
            InputProps={{
                inputComponent: NumberFormatCustom as any,
                endAdornment: <InputAdornment position="end">PLN</InputAdornment>,
            }}
            variant="outlined"
            required
        />
    );
};

export default withTranslate(PriceInput);
