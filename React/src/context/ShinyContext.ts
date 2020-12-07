import React from 'react';
import Mtcars from '../models/Mtcars';

interface ContextType {
    apiUrl: string;
    valApiUrl: string;
    seconds: number;
    value: number;
    mtcars: Mtcars[];
    handleClickRandom(): void;
}

const Context = React.createContext<Partial<ContextType>>({});

export default Context;
