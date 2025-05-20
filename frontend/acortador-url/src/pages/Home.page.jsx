import { useContext } from "react";

import { AuthContext } from "../auth/AuthContext";
import { Navigate, NavLink } from "react-router-dom";

export default function Home() {
    
    const { isAuthenticated, user } = useContext(AuthContext);
    console.log("isAuthenticated:", isAuthenticated)

    console.log("user:", user)
    return (
        <>
            { isAuthenticated ? (
                <div>
                    <h2>Bienvenido, {user.username}</h2>
                    <p>Tu token de acceso es: {user.access_token}</p>
                    <NavLink to="/new-link">Ir a acortador</NavLink>
                </div>
            ) : (
                <div>
                    <h2>No estás autenticado</h2>
                    <p>Por favor, inicia sesión.</p>
                    <NavLink to="/login">Iniciar sesión</NavLink>
                </div>
            )}
            
        </>
    );

}