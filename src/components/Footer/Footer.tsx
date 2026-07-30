import "./Footer.css";

export default function Footer() {

    return (

        <footer>

            <div className="footer">

            

            <div className="footer-esquerda">

                <h3> VivaPet </h3>
                <p>
                    Sistema para o gerenciamento de abrigo de animais.
                </p>

            </div>

            <div className="footer-centro">

                <h4> Mapa de navegação </h4>

                <ul>
                    <li>Animais</li>
                    <li>Cuidadores</li>
                    <li>Necessidades</li>
                    <li>Suprimentos</li>
                </ul>

            </div>


            <div className="footer-direita">

                <h4>Contato: </h4>
                <p>
                    contato@vivapet.com.br
                </p>

                <p>
                    (84) 98877-6655
                </p>

            </div>

            </div>


            <div className="footer-copyright">

                <p>
                    &copy; Copyright 2026 Senac RN. Todos os direitos reservados.
                </p>

            </div>

        </footer>
    )
}