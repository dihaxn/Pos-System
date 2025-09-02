import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [state, setState] = useState({
        // Initial state
    });

    return (
        <AppContext.Provider value={{ state, setState }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
