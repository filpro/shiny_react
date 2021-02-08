import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import plLocale from 'date-fns/locale/pl';
import withTranslate, { WithTranslateProps } from '../../../../infrastructure/internationalization/hoc/WithTranslate';
import Translations from '../../../../infrastructure/internationalization/Translations';

interface IProps {
    date: Date | null;
    handleDateChange(date: Date | null): void;
}

const DatePicker: React.FC<IProps & WithTranslateProps> = (props: IProps & WithTranslateProps): JSX.Element => {
    // The first commit of Material-UI
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={plLocale}>
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd-MM-yyyy"
                margin="normal"
                id="date-picker-inline"
                label={props.translate(Translations.NewTransaction.TransmissionDate)}
                value={props.date}
                onChange={(e) => props.handleDateChange(e)}
                autoOk
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
                inputVariant="outlined"
                required
            />
        </MuiPickersUtilsProvider>
    );
};

export default withTranslate(DatePicker);
