export default function Register() {
    return (
        <div>
            <h1>Register</h1>
            <form>
                <input type="text" placeholder="Enter your name" required />
                <input type="email" placeholder="Enter your email" required />
                <input type="password" placeholder="Enter your password" required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}