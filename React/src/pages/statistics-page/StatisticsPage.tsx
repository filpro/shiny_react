import { Grid, Typography, Button } from '@material-ui/core';
import React from 'react';

const StatisticsPage: React.FC = (): JSX.Element => {
    return (
        <Grid item>
            <Typography color="textSecondary" gutterBottom>
                Hello
            </Typography>
            <Button size="small">Get random</Button>
        </Grid>
    );
};

export default StatisticsPage;
