import { Switch, Route, Redirect } from 'react-router-dom';
import React from 'react';
import TransactionsPage from '../../pages/transactions-page/TransactionsPage';
import SearchPage from '../../pages/search-page/SearchPage';

const AppRouter: React.FC = (): JSX.Element => {
    return (
        <Switch>
            <Route exact path="/">
                <Redirect to="/transactions" />
            </Route>
            <Route path="/transactions">
                <TransactionsPage />
            </Route>
            <Route path="/search">
                <SearchPage />
            </Route>
        </Switch>
    );
};

export default AppRouter;
