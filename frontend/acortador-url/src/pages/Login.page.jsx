import { useContext } from "react";

import { AuthContext } from "../auth/AuthContext";

export default function Login() {

    const { user, login } = useContext(AuthContext);

    const handlerSubmit = (e) => {
        e.preventDefault();
        let credentials = {
            "username": e.target.username.value,
            "password": e.target.password.value
        }
        login(credentials)
    }

    return (
        <div>
            <h1>Login</h1>
            <form type="submit" onSubmit={handlerSubmit}>
                <input type="text" name="username" placeholder="Enter your username" required />
                <input type="password" name="password" placeholder="Enter your password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}