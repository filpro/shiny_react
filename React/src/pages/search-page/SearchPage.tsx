import React from 'react';
import DenseTable from '../../components/Mytable/Mytable';
import ShinyContext from '../../context/ShinyContext';

const SearchPage: React.FC = (): JSX.Element => {
    const { mtcars } = React.useContext(ShinyContext);

    return (
        <div>
            <DenseTable data={mtcars!} />
        </div>
    );
};

export default SearchPage;
