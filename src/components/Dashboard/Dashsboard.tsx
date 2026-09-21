"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./Dashboard.css";

// --- SUB-COMPONENTE: CARTÃO DASHBOARD ---
type CartaoProps = {
    titulo: string;
    valor: number | string;
    corDeDestaque?: string;
    carregando?: boolean;
};

function CartaoDashboard({ titulo, valor, corDeDestaque = "var(--roxo-viva)", carregando = false }: CartaoProps) {
    return (
        <div className="cartao-dashboard" style={{ borderLeft: `5px solid ${corDeDestaque}` }}>
            <h3 className="cartao-titulo">{titulo}</h3>
            {carregando ? (
                <span className="cartao-loading">Buscando...</span>
            ) : (
                <span className="cartao-valor">{valor}</span>
            )}
        </div>
    );
}

// --- COMPONENTE PRINCIPAL: TELA DE DASHBOARD ---
export default function DashboardPrincipal() {
    const router = useRouter();

    const [totalAnimais, setTotalAnimais] = useState<number | string>("-");
    const [totalCuidadores, setTotalCuidadores] = useState<number | string>("-");
    const [totalSuprimentos, setTotalSuprimentos] = useState<number | string>("-");

    const [ultimoAnimal, setUltimoAnimal] = useState<string>("");
    const [ultimoCuidador, setUltimoCuidador] = useState<string>("");

    const [carregando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState("");

    const exibirMensagem = (texto: string) => {
        setMensagem(texto);
        setTimeout(() => {
            setMensagem("");
        }, 3000);
    };

    const carregarResumoDoSistema = async (exibirAlerta = true) => {
        setCarregando(true);
        if (exibirAlerta) setMensagem("Atualizando indicadores...");

        try {
            const [resAnimais, resCuidadores, resSuprimentos] = await Promise.all([
                fetch("/api/animais", { cache: "no-store" }),
                fetch("/api/cuidadores", { cache: "no-store" }),
                fetch("/api/suprimentos", { cache: "no-store" })
            ]);

            if (resAnimais.ok) {
                const animais = await resAnimais.json();
                setTotalAnimais(animais.length || 0);
                if (animais.length > 0) {
                    const ultimo = animais[animais.length - 1];
                    setUltimoAnimal(ultimo.nome ?? ultimo._nome);
                }
            }

            if (resCuidadores.ok) {
                const cuidadores = await resCuidadores.json();
                setTotalCuidadores(cuidadores.length || 0);
                if (cuidadores.length > 0) {
                    const ultimo = cuidadores[cuidadores.length - 1];
                    setUltimoCuidador(ultimo.nome ?? ultimo._nome);
                }
            }

            if (resSuprimentos.ok) {
                const suprimentos = await resSuprimentos.json();
                setTotalSuprimentos(suprimentos.length || 0);
            }

            if (exibirAlerta) exibirMensagem("Resumo de informações atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao carregar dashboard:", error);
            if (exibirAlerta) exibirMensagem("Falha na comunicação com o servidor.");
        } finally {
            setCarregando(false);
        }
    };

    // Inicialização segura com useState
    const [inicializado] = useState(() => {
        carregarResumoDoSistema(false);
        return true;
    });

    return (
        <div className="container dashboard-container">

            {mensagem && (
                <div className="alerta" style={{ marginBottom: "20px" }}>
                    <strong>Sistema:</strong> {mensagem}
                </div>
            )}

            {/* SEÇÃO: BOAS VINDAS */}
            <section className="dashboard-header">
                <h1 className="titulo-principal" style={{ fontSize: "2.5rem" }}>
                    Bem-vindo!
                </h1>
                <p>Sistema Integrado de Gerenciamento de Abrigo de Animais.</p>
            </section>

            {/* SEÇÃO: CARTÕES DE INDICADORES */}
            <section className="dashboard-cards-grid">
                <CartaoDashboard
                    titulo="Animais no Abrigo"
                    valor={totalAnimais}
                    corDeDestaque="var(--roxo-viva)"
                    carregando={carregando}
                />
                <CartaoDashboard
                    titulo="Cuidadores Ativos"
                    valor={totalCuidadores}
                    corDeDestaque="var(--verde-viva)"
                    carregando={carregando}
                />
                <CartaoDashboard
                    titulo="Tipos de Suprimentos"
                    valor={totalSuprimentos}
                    corDeDestaque="var(--coral-viva)"
                    carregando={carregando}
                />
            </section>

            {/* SEÇÃO INFERIOR: AÇÕES E ATIVIDADES */}
            <div className="dashboard-secoes">

                {/* AÇÕES RÁPIDAS */}
                <section className="dashboard-secao">
                    <h2 className="subtitulo" style={{ marginBottom: "20px" }}>Ações Rápidas</h2>

                    <div className="dashboard-acoes-lista">
                        {/* Todos os botões padronizados com a cor principal */}
                        <button onClick={() => router.push('/animais')} className="btn-acao btn-primario">
                            🐾 Gestão de Animais
                        </button>
                        <button onClick={() => router.push('/cuidadores')} className="btn-acao btn-primario">
                            👥 Gestão de Cuidadores
                        </button>
                        <button onClick={() => router.push('/suprimentos')} className="btn-acao btn-primario">
                            📦 Gestão de Suprimentos
                        </button>
                        <button onClick={() => router.push('/doacoes')} className="btn-acao btn-primario">
                            ❤️ Receber Doações (Entrada)
                        </button>
                        <button onClick={() => router.push('/necessidades')} className="btn-acao btn-primario">
                            🩺 Prontuários e Necessidades
                        </button>
                        <button onClick={() => router.push('/registros-uso')} className="btn-acao btn-primario">
                            📉 Registrar Uso (Saída)
                        </button>
                    </div>
                </section>

                {/* ÚLTIMAS ATIVIDADES */}
                <section className="dashboard-secao">
                    <h2 className="subtitulo" style={{ marginBottom: "20px" }}>Últimas Atividades </h2>

                    <ul className="dashboard-atividades-lista">
                        {carregando && totalAnimais === "-" ? (
                            <li className="dashboard-atividade-item" style={{ color: "var(--texto-mutado)", fontStyle: "italic" }}>
                                Sincronizando registros...
                            </li>
                        ) : (
                            <>
                                {ultimoAnimal ? (
                                    <li className="dashboard-atividade-item">
                                        <span className="dashboard-atividade-icone">➔</span>
                                        Novo animal acolhido: <strong>{ultimoAnimal}</strong>
                                    </li>
                                ) : (
                                    <li className="dashboard-atividade-item">
                                        <span className="dashboard-atividade-icone">➔</span>
                                        Nenhum animal listado na sessão.
                                    </li>
                                )}

                                {ultimoCuidador ? (
                                    <li className="dashboard-atividade-item">
                                        <span className="dashboard-atividade-icone">➔</span>
                                        Novo cuidador na equipe: <strong>{ultimoCuidador}</strong>
                                    </li>
                                ) : (
                                    <li className="dashboard-atividade-item">
                                        <span className="dashboard-atividade-icone">➔</span>
                                        Nenhum cuidador listado na sessão.
                                    </li>
                                )}
                            </>
                        )}
                        <li className="dashboard-atividade-rodape">
                            Visão geral do ecossistema do abrigo.
                        </li>
                    </ul>

                    {/* BOTÃO DE ATUALIZAÇÃO REPOSICIONADO PARA DENTRO DO CARD */}
                    <button
                        onClick={() => carregarResumoDoSistema(true)}
                        disabled={carregando}
                        className="dashboard-btn-atualizar"
                    >
                        {carregando ? "Sincronizando..." : "Atualizar resumo de informações"}
                    </button>

                </section>
            </div>

        </div>
    );
}