import Link from "next/link";

export default function Header(){

    return(

        <header className="header">
            <div className="header-container">
                
                <div className="logo">
                    <Link href="/"> VivaPet </Link>

                    <nav className="menu">
                       
                    </nav>

                </div>

            </div>

        </header>
    )
}