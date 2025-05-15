export default function Login() {
    return (
        <div>
            <h1>Login</h1>
            <form>
                <input type="email" placeholder="Enter your email" required />
                <input type="password" placeholder="Enter your password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}