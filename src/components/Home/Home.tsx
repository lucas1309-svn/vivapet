import AcoesRapidas from "./AcoesRapidas/AcoesRapidas";
import BoasVindas from "./BoasVindas/BoasVindas";
import CartaoDashboard from "./CartaoDashboard/CartaoDashboard";

import "./Home.css"
import UltimasAtividades from "./UltimasAtividades/UltimasAtividades";

export default function Home(){

    return(

        <div>

            <main className="home">

            <BoasVindas />


            
                <section className="grade-cartoes">



                    <CartaoDashboard titulo="Animais" valor={38} />

                    <CartaoDashboard titulo="Cuidadores" valor={12} />

                    <CartaoDashboard titulo="Suprimentos" valor={87} />

                    <CartaoDashboard titulo="Necessidades" valor={6} />



                </section>



                <AcoesRapidas />

                <UltimasAtividades />

            </main>

        </div>
    );
}