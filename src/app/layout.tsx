import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "./globals.css"
import "./estilo.css"



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html lang="pt-BR">
      <body>

        <Header />

        {children}

        <Footer />

      </body>
    </html>

  );
}