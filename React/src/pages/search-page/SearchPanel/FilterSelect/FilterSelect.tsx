import { createStyles, makeStyles, TextField, Theme } from '@material-ui/core';
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
