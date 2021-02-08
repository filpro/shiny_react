import { CircularProgress, InputAdornment, TextField } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import CheckIcon from '@material-ui/icons/Check';
import React from 'react';
import withTranslate, { WithTranslateProps } from '../../../../infrastructure/internationalization/hoc/WithTranslate';
import Translations from '../../../../infrastructure/internationalization/Translations';

interface IProps {
    productName: string;
    handleProductNameChange(id: string): void;
    isInvalid: boolean | undefined;
    isChecking: boolean | undefined;
}

const ProductName: React.FC<IProps & WithTranslateProps> = (props: IProps & WithTranslateProps): JSX.Element => {
    const iconStatus =
        // eslint-disable-next-line no-nested-ternary
        props.isChecking || (props.isInvalid === undefined && props.productName !== '') ? (
            <CircularProgress size={19} />
        ) : // eslint-disable-next-line no-nested-ternary
        props.isInvalid && props.productName !== '' ? (
            <ErrorIcon style={{ color: 'rgba(255,0,0,0.5)' }} />
        ) : props.productName !== '' && props.isInvalid !== undefined ? (
            <CheckIcon style={{ color: 'rgba(0,128,0,0.5)' }} />
        ) : (
            <></>
        );

    return (
        <TextField
            id="standard-basic"
            value={props.productName}
            onChange={(e) => props.handleProductNameChange(e.target.value)}
            autoComplete="off"
            label={props.translate(Translations.NewTransaction.ProductNumber)}
            variant="outlined"
            required
            InputProps={{
                endAdornment: <InputAdornment position="end">{iconStatus}</InputAdornment>,
            }}
        />
    );
};

export default withTranslate(ProductName);
