import { useContext } from "react";

import { AuthContext } from "../auth/AuthContext";
import { NavLink } from "react-router-dom";
import UserLinks from "./UserLinks.page";

export default function Home() {
    
    const { isAuthenticated, username, accessToken } = useContext(AuthContext);
    console.log("isAuthenticated:", isAuthenticated)

    console.log("username:", username)
    return (
        <div>
            <h2>Bienvenido, {username}</h2>
            <p>Tu token de acceso es: {accessToken}</p>
            <NavLink to="/new-link">Ir a acortador</NavLink>

            <UserLinks />
        </div>      
    );
}