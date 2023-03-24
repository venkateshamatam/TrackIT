import { createContext, useState } from "react";

// Create User Context
export const UserContext = new createContext({
    user: {},
    setUser: () => null,
});

// Provider function which will let children use Context Variables
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({})
    const value = { user, setUser }

    return <UserContext.Provider value={value}> {children}</UserContext.Provider>
}
