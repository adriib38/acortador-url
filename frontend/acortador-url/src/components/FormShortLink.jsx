import { Button } from "./shared/Button";

export default function FormShortLink() {
    
    const handleSubmit = (e) => {
        e.preventDefault(); 
        const url = e.target[0].value;
        console.log(url)
        console.log('Formulario enviado', url);
    }

    return (
        <div className="home">
        <h1>Acortador Urls</h1>
            <form type="submit" onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter URL" required />
                <Button text="Shorten URL" type="submit"/>
            </form>
        </div>
    );
}