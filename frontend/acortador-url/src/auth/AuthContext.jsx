import { createContext, useState, useEffect } from 'react';
import { 
    getUser, 
    login as loginService,
    logout as logoutService
} from './authService';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = getUser();
        if(storedUser) setUser(storedUser);
    }, []);

    const login = async(credentials) => {
        const user = await loginService(credentials)
        setUser(user)
    }

    const logout = () => {
        logoutService();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}