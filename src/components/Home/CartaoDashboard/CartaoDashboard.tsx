
import "./CartaoDashboard.css"

type props = {
    titulo: string;
    valor: number;
}

export default function CartaoDashboard({ titulo, valor }: props) {

    return (

        <div className="cartao-dashboard">

            <h3> {titulo} </h3>

            <span> {valor} </span>

        </div>

    );
}