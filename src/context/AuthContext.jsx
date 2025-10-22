import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    const login = (role) => {
        setUserRole(role);
        navigate('/dashboard');
    };

    const logout = () => {
        setUserRole(null);
        navigate('/login');
    };

    const value = { userRole, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};