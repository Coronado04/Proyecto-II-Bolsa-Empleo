import { createContext, useState } from 'react';

const AppContext = createContext();

function AppProvider(props) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    return (
        <AppContext.Provider value={{
            user,
            setUser,
            token,
            setToken,
        }}>
            {props.children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };