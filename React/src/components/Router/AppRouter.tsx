import { Switch, Route } from 'react-router-dom';
import React from 'react';
import StatisticsPage from '../../pages/statistics-page/StatisticsPage';
import DashboardPage from '../../pages/dashboard-page/DashboardPage';
import TransactionsPage from '../../pages/transactions-page/TransactionsPage';
import SearchPage from '../../pages/search-page/SearchPage';

const AppRouter: React.FC = (): JSX.Element => {
    return (
        <Switch>
            <Route exact path="/">
                <DashboardPage />
            </Route>
            <Route path="/dashboard">
                <DashboardPage />
            </Route>
            <Route path="/transactions">
                <TransactionsPage />
            </Route>
            <Route path="/search">
                <SearchPage />
            </Route>
            <Route path="/statistics">
                <StatisticsPage />
            </Route>
        </Switch>
    );
};

export default AppRouter;
