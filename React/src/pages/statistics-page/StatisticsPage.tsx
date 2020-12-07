import { Grid, Typography, Button } from '@material-ui/core';
import React, { useContext } from 'react';
import ShinyContext from '../../context/ShinyContext';

const StatisticsPage: React.FC = (): JSX.Element => {
    const { apiUrl, valApiUrl, seconds, value, handleClickRandom } = useContext(ShinyContext);
    return (
        <Grid item>
            <Typography color="textSecondary" gutterBottom>
                {`Geets an API: ${apiUrl} - ${seconds} - ${value}`}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
                {`Get an API: ${valApiUrl} - ${seconds} - ${value}`}
            </Typography>
            <Button size="small" onClick={() => handleClickRandom!()}>
                Get random
            </Button>
        </Grid>
    );
};

export default StatisticsPage;
