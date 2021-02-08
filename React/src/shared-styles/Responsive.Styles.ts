import { makeStyles, Theme, createStyles } from '@material-ui/core';

const useResponsiveStyles = makeStyles((theme: Theme) =>
    createStyles({
        horizontalGaps: {
            marginLeft: theme.spacing(0),
            marginRight: theme.spacing(0),
            [theme.breakpoints.down('md')]: {
                paddingLeft: theme.spacing(2),
                paddingRight: theme.spacing(2),
            },
        },
        noHorizontalGapsDownSmall: {
            [theme.breakpoints.down('sm')]: {
                paddingLeft: '0 !important',
                paddingRight: '0 !important',
            },
        },
    })
);

export default useResponsiveStyles;
