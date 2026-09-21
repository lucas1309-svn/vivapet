"use client";

import Link from "next/link";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer-wrapper">

            <div className="footer">

                {/* COLUNA 1: IDENTIDADE E SOBRE */}
                <div className="footer-esquerda">
                    <h3>🐾 VivaPet</h3>
                    <p>
                        Sistema integrado para gerenciamento de abrigo de animais.
                        Cuidando de cada vida com tecnologia e amor.
                    </p>
                </div>

                {/* COLUNA 2: MAPA DO SITE FUNCIONAL */}
                <div className="footer-centro">
                    <h4>Mapa de navegação</h4>
                    <ul>
                        <li><Link href="/">Dashboard Inicial</Link></li>
                        <li><Link href="/animais">Gestão de Animais</Link></li>
                        <li><Link href="/cuidadores">Equipe de Cuidadores</Link></li>
                        <li><Link href="/suprimentos">Estoque de Suprimentos</Link></li>
                        <li><Link href="/doacoes">Entrada (Doações)</Link></li>
                        <li><Link href="/registros-uso">Saída (Consumo)</Link></li>
                        <li><Link href="/necessidades">Prontuários e Tarefas</Link></li>
                    </ul>
                </div>

                {/* COLUNA 3: CONTATO E INFORMAÇÕES */}
                <div className="footer-direita">
                    <h4>Contato</h4>
                    <p>
                        <span className="footer-icone">✉️</span>
                        contato@vivapet.com.br
                    </p>
                    <p>
                        <span className="footer-icone">📞</span>
                        (84) 98877-6655
                    </p>
                </div>

            </div>

            {/* BARRA DE DIREITOS AUTORAIS */}
            <div className="footer-copyright">
                <p>&copy; Copyright 2026 Senac RN. Todos os direitos reservados.</p>
            </div>

        </footer>
    );
}