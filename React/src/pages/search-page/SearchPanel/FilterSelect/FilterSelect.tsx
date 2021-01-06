import { createStyles, fade, makeStyles, TextField, Theme } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { observer } from 'mobx-react';
import React, { useContext } from 'react';
import InspectTransactionStore from '../../../../stores/TransactionInspect.Store';

interface IProps<T> {
    label: string;
    optionLabel(option: T): string;
    renderOption(option: T): JSX.Element;
    options: T[] | undefined;
    changeHandler(value: T[] | [], reason: string): void;
    filter: T[] | undefined;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 221,
            fontSize: 13,
        },
        button: {
            fontSize: 13,
            width: '100%',
            textAlign: 'left',
            paddingBottom: 8,
            color: '#586069',
            fontWeight: 600,
            '&:hover,&:focus': {
                color: '#0366d6',
            },
            '& span': {
                width: '100%',
            },
            '& svg': {
                width: 16,
                height: 16,
            },
        },
        tag: {
            marginTop: 3,
            height: 20,
            padding: '.15em 4px',
            fontWeight: 600,
            lineHeight: '15px',
            borderRadius: 2,
        },
        popper: {
            border: '1px solid rgba(27,31,35,.15)',
            boxShadow: '0 3px 12px rgba(27,31,35,.15)',
            borderRadius: 3,
            width: 300,
            zIndex: 1,
            fontSize: 13,
            color: '#586069',
            backgroundColor: '#f6f8fa',
        },
        header: {
            borderBottom: '1px solid #e1e4e8',
            padding: '8px 10px',
            fontWeight: 600,
        },
        inputBase: {
            padding: 10,
            width: '100%',
            borderBottom: '1px solid #dfe2e5',
            '& input': {
                borderRadius: 4,
                backgroundColor: theme.palette.common.white,
                padding: 8,
                transition: theme.transitions.create(['border-color', 'box-shadow']),
                border: '1px solid #ced4da',
                fontSize: 14,
                '&:focus': {
                    boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
                    borderColor: theme.palette.primary.main,
                },
            },
        },
        paper: {
            boxShadow: 'none',
            margin: 0,
            color: '#586069',
            fontSize: 13,
        },
        option: {
            minHeight: 'auto',
            alignItems: 'flex-start',
            padding: 8,
            '&[aria-selected="true"]': {
                backgroundColor: 'transparent',
            },
            '&[data-focus="true"]': {
                backgroundColor: theme.palette.action.hover,
            },
        },
        popperDisablePortal: {
            position: 'relative',
        },
        iconSelected: {
            width: 17,
            height: 17,
            marginRight: 5,
            marginLeft: -2,
        },
        color: {
            width: 14,
            height: 14,
            flexShrink: 0,
            borderRadius: 3,
            marginRight: 8,
            marginTop: 2,
        },
        text: {
            flexGrow: 1,
            backgroundColor: 'blue',
        },
        close: {
            opacity: 0.6,
            width: 18,
            height: 18,
        },
    })
);

const FilterSelect = observer(
    <T,>(props: IProps<T>): JSX.Element => {
        const inspectTransactionsStore = useContext(InspectTransactionStore);
        const classes = useStyles();
        return inspectTransactionsStore.serverFilteredCustomers === null ? (
            <></>
        ) : (
            <>
                <Autocomplete
                    size="small"
                    id="combo-box-demo"
                    multiple
                    classes={{
                        option: classes.option,
                    }}
                    filterSelectedOptions
                    options={props.options || []}
                    getOptionLabel={props.optionLabel}
                    value={props.filter || []}
                    onChange={(_, newValue, reason) => props.changeHandler(newValue, reason)}
                    renderInput={(params) => <TextField {...params} label={props.label} fullWidth />}
                    renderOption={props.renderOption}
                    noOptionsText="Brak możliwych opcji"
                    disableListWrap={false}
                    ListboxProps={{
                        style: {
                            maxHeight: '150px',
                            border: '1px solid black',
                            fontSize: 'small',
                        },
                    }}
                />
            </>
        );
    }
);

export default FilterSelect;
