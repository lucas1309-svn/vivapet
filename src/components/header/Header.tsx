"use client";

import Link from "next/link";
import "./Header.css";

export default function Header() {
    return (
        <header className="header">
            <div className="header-container">

                {/* LOGO ANIMADA */}
                <div className="logo">
                    <Link href="/">
                        🐾 VivaPet
                    </Link>
                </div>

                {/* MENUS E SUBMENUS AGRUPADOS */}
                <nav className="menu">

                    {/* GRUPO 1: ABRIGO (Animais e Necessidades) */}
                    <div className="menu-item">
                        <span>Abrigo</span>
                        <div className="submenu">
                            <Link href="/animais">Gestão de Animais</Link>
                            <Link href="/doadores">Gestão de Doadores</Link>
                            <Link href="/necessidades">Prontuários e Necessidades</Link>
                        </div>
                    </div>

                    {/* GRUPO 2: EQUIPE */}
                    <div className="menu-item">
                        <span>Equipe</span>
                        <div className="submenu">
                            <Link href="/cuidadores">Gestão de Cuidadores</Link>
                        </div>
                    </div>

                    {/* GRUPO 3: ESTOQUE (Suprimentos, Doações e Consumo) */}
                    <div className="menu-item">
                        <span>Estoque</span>
                        <div className="submenu">
                            <Link href="/suprimentos">Lista de Suprimentos</Link>
                            <Link href="/doacoes">Entrada (Receber Doações)</Link>
                            <Link href="/registros-uso">Saída (Registrar Consumo)</Link>
                        </div>
                    </div>

                </nav>

                {/* BOTÃO DE DESTAQUE DIREITO */}
                <div className="menu-destaque">
                    <Link href="/doacoes/historico">
                        Listar doações
                    </Link>
                </div>

            </div>
        </header>
    );
}