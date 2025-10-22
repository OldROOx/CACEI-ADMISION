import React from 'react';
import { useAuth } from '../../context/AuthContext';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';

const Login = () => {
    const { login } = useAuth();

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-sm text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Bienvenido</h1>
                <p className="text-gray-500 mb-6">Seleccione cómo desea ingresar al sistema.</p>
                <div className="space-y-3">
                    <PrimaryButton onClick={() => login('director')}>
                        Entrar como Director de Carrera
                    </PrimaryButton>
                    <SecondaryButton onClick={() => login('guest')}>
                        Entrar como Invitado
                    </SecondaryButton>
                </div>
            </div>
        </div>
    );
};

export default Login;