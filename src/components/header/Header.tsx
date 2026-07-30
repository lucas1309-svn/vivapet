"use client"

import "./Header.css";
import Link from "next/link";

export default function Header() {

    return (

        <header className="header">


            <div className="header-container">


                <div className="logo">
                    <Link href="/"> VivaPet </Link>
                </div>


                <nav className="menu">

                    <div className="menu-item">
                        <span>Animais</span>

                        <div className="submenu">
                            <Link href="/animais/cadastrar"> Cadastrar novo animal </Link>
                            <Link href="/animais/necessidades"> Cadastrar necessidades do animal </Link>
                        </div>

                    </div>


                    <div className="menu-item">
                        <span>Cuidadores</span>

                        <div className="submenu">
                            <Link href="/cuidadores/cadastrar"> Cadastrar novo cuidador </Link>
                            <Link href="/cuidadores/vincular"> Vincular cuidador </Link>
                        </div>
                        
                    </div>


                    <div className="menu-item">
                        <span>Suprimentos</span>

                        <div className="submenu">
                            <Link href="/suprimentos/cadastrar"> Cadastrar novo suprimento </Link>
                            <Link href="/suprimentos/checar"> Checar suprimento </Link>
                        </div>
                        
                    </div>

                </nav>


                <div className="donations">
                    <Link href="/doacoes"> Doações </Link>
                </div>

            </div>

        </header>
    );
}