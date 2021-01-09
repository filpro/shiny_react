import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

interface IProps {
    date: Date | null;
    handleDateChange(date: Date | null): void;
}

const DatePicker: React.FC<IProps> = (props: IProps): JSX.Element => {
    // The first commit of Material-UI
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd-MM-yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Data transmisji"
                value={props.date}
                onChange={(e) => props.handleDateChange(e)}
                autoOk
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
        </MuiPickersUtilsProvider>
    );
};

export default DatePicker;
