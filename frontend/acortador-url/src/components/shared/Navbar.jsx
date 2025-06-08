import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {

    return (
        <nav className="navbar">
            <div className="container">
                <h1>Acortador de URLs</h1>
                <ul>
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/new-link">Nuevo Enlace</Link></li>
                    <li><Link to="/profile">Perfil</Link></li>
                    <li><Link to="/login">Iniciar Sesión</Link></li>
                </ul>
            </div>
        </nav>
    );
}