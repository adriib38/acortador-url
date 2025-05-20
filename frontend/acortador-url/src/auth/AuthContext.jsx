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
        if(storedUser && storedUser.username) setUser(storedUser);
        else setUser(null);
    }, []);

    const login = async(credentials) => {
        const response = await loginService(credentials);
        //Save cookie 
        document.cookie = `token=${response.data.access_token}; path=/; max-age=3600;`;
  
        const userObj = {
            username: response.data.user,
            access_token: response.data.access_token
        };
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj))
    }

    const logout = () => {
        logoutService();
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}