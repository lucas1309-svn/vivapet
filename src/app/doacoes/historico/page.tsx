"use client";

import { useState } from "react";

interface Doacao {
    id_doacao: number;
    data_doacao: string;
    id_doador: number;
    raw_data?: string; // Para nossa ferramenta de debug
}

interface DoadorResumo {
    id_doador: number;
    nome: string;
}

export default function TelaHistoricoDoacoes() {
    const [doacoes, setDoacoes] = useState<Doacao[]>([]);
    const [doadoresLista, setDoadoresLista] = useState<DoadorResumo[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState("");
    const [inicializado, setInicializado] = useState(false);

    const exibirMensagem = (texto: string) => {
        setMensagem(texto);
        setTimeout(() => {
            setMensagem("");
        }, 5000);
    };

    // --- FUNÇÕES INTELIGENTES DE MAPEAMENTO ---
    // Essas funções vasculham o objeto procurando o ID, não importa como você o tenha nomeado no Back-end!
    const extrairIdDoacao = (obj: any): number => {
        if (!obj) return 0;
        const exato = obj.id_doacao ?? obj._id_doacao ?? obj.idDoacao ?? obj._idDoacao ?? obj.id ?? obj._id;
        if (exato !== undefined && exato !== null) return Number(exato);

        // Busca inteligente pelas chaves do objeto
        const chaveFuzzy = Object.keys(obj).find(k => k.toLowerCase().includes('id') && k.toLowerCase().includes('doacao'));
        return chaveFuzzy ? Number(obj[chaveFuzzy]) : 0;
    };

    const extrairIdDoador = (obj: any): number => {
        if (!obj) return 0;
        const exato = obj.id_doador ?? obj._id_doador ?? obj.idDoador ?? obj._idDoador ?? obj.doador_id ?? obj.doadorId;
        if (exato !== undefined && exato !== null) return Number(exato);

        // Busca inteligente pelas chaves do objeto
        const chaveFuzzy = Object.keys(obj).find(k => k.toLowerCase().includes('doador') && k.toLowerCase().includes('id'));
        return chaveFuzzy ? Number(obj[chaveFuzzy]) : 0;
    };

    const extrairIdDoadorLista = (obj: any): number => {
        if (!obj) return 0;
        const exato = obj.id_doador ?? obj._id_doador ?? obj.idDoador ?? obj.id ?? obj._id;
        if (exato !== undefined && exato !== null) return Number(exato);

        const chaveFuzzy = Object.keys(obj).find(k => k.toLowerCase().includes('id'));
        return chaveFuzzy ? Number(obj[chaveFuzzy]) : 0;
    };


    const carregarDadosGlobais = async (exibirAlerta = true) => {
        setCarregando(true);
        if (exibirAlerta) setMensagem("Sincronizando banco de dados...");

        try {
            const [resDoacoes, resDoadores] = await Promise.all([
                fetch("/api/doacoes", { cache: "no-store" }),
                fetch("/api/doadores", { cache: "no-store" })
            ]);

            if (!resDoacoes.ok) throw new Error(`Erro na API de doações: ${resDoacoes.status}`);

            // 1. Mapeamento de Doadores
            if (resDoadores.ok) {
                const dataDoadores = await resDoadores.json();
                setDoadoresLista(Array.isArray(dataDoadores) ? dataDoadores.map((d: any) => ({
                    id_doador: extrairIdDoadorLista(d),
                    nome: d.nome ?? d._nome ?? "Doador não identificado"
                })) : []);
            }

            // 2. Mapeamento de Doações com Busca Inteligente
            const dataDoacoes = await resDoacoes.json();
            const arrayDoacoes = Array.isArray(dataDoacoes) ? dataDoacoes : (dataDoacoes.data || []);

            let listaMapeada: Doacao[] = arrayDoacoes.map((d: any) => ({
                id_doacao: extrairIdDoacao(d),
                data_doacao: d.data_doacao ?? d._data_doacao ?? "",
                id_doador: extrairIdDoador(d),
                raw_data: JSON.stringify(d) // Salva o JSON cru para ajudar a debugar se precisar
            }));

            // Ordenação garantida numéricamente (Maior ID no topo)
            listaMapeada.sort((a, b) => {
                if (!isNaN(a.id_doacao) && !isNaN(b.id_doacao) && a.id_doacao !== 0 && b.id_doacao !== 0) {
                    return b.id_doacao - a.id_doacao;
                }
                const dataA = new Date(a.data_doacao || 0).getTime();
                const dataB = new Date(b.data_doacao || 0).getTime();
                return dataB - dataA;
            });

            const ultimas20Doacoes = listaMapeada.slice(0, 20);
            setDoacoes(ultimas20Doacoes);

            if (exibirAlerta) exibirMensagem("Histórico atualizado com sucesso!");
        } catch (error: unknown) {
            console.error("Falha ao carregar dados:", error);
            const msgErro = error instanceof Error ? error.message : "Erro desconhecido";
            exibirMensagem(`Falha ao conectar com o banco de dados. (${msgErro})`);
        } finally {
            setCarregando(false);
        }
    };

    const autoCarregarRef = (el: HTMLDivElement | null) => {
        if (el && !inicializado) {
            setInicializado(true);
            carregarDadosGlobais(false);
        }
    };

    // Helper robusto para buscar o nome do doador
    const getNomeDoador = (id: number) => {
        const doador = doadoresLista.find(d => d.id_doador === id);
        return doador ? doador.nome : "Doador não encontrado";
    };

    const formatarDataTabela = (dataStr: string) => {
        if (!dataStr) return "N/A";
        return new Date(dataStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    return (
        <div className="container" ref={autoCarregarRef}>
            {mensagem && (
                <div className="alerta">
                    <strong>Sistema:</strong> {mensagem}
                </div>
            )}

            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                <section className="coluna-lista" style={{ width: "100%" }}>
                    <h1 className="titulo-principal">Histórico de Doações</h1>
                    <h2 className="subtitulo" style={{ marginBottom: "15px" }}>
                        Últimos 20 registros de entrada no abrigo
                    </h2>

                    <div className="tabela-wrapper" style={{ maxHeight: "500px", overflowY: "auto", border: "1px solid #eee", backgroundColor: "#fff" }}>
                        <table className="tabela">
                            <thead style={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "#f8f9fa", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                                <tr className="tabela-cabecalho">
                                    <th>Cód.</th>
                                    <th>Data Recebida</th>
                                    <th>Nome do doador</th>
                                    <th>Suprimentos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carregando && doacoes.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="tabela-vazia" style={{ padding: "40px 0" }}>
                                            Carregando registros de doações...
                                        </td>
                                    </tr>
                                ) : doacoes.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="tabela-vazia" style={{ padding: "40px 0" }}>
                                            Nenhuma doação encontrada no banco de dados.
                                        </td>
                                    </tr>
                                ) : (
                                    doacoes.map((d) => (
                                        // O TITLE ABAIXO É O NOSSO DEBUGGER! Passe o mouse na linha para ver os dados crus.
                                        <tr key={d.id_doacao || Math.random()} title={`Dados do Banco: ${d.raw_data}`}>
                                            <td style={{ fontWeight: "bold", color: "#666" }}>
                                                {d.id_doacao}
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: "600", color: "#333" }}>
                                                    {formatarDataTabela(d.data_doacao)}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ color: "var(--roxo-viva)", fontWeight: "bold" }}>
                                                    {getNomeDoador(d.id_doador)}
                                                </span>
                                                <span style={{ fontSize: "0.85rem", color: "var(--texto-mutado)", marginLeft: "8px" }}>
                                                    (Cód. {d.id_doador})
                                                </span>
                                            </td>
                                            <td style={{ color: "var(--texto-mutado)", fontStyle: "italic", fontSize: "0.9rem" }}>
                                                Aguardando itens...
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
                        <span style={{ fontSize: "0.9rem", color: "var(--texto-mutado)", fontStyle: "italic" }}>
                            Exibindo limite máximo de 20 registros. Dica: Passe o mouse sobre a linha para ver os dados crus.
                        </span>

                        <button onClick={() => carregarDadosGlobais(true)} disabled={carregando} className="botao-atualizar" style={{ margin: 0, width: "auto" }}>
                            {carregando ? "Sincronizando..." : "Atualizar Lista de Doações"}
                        </button>
                    </div>

                </section>
            </div>
        </div>
    );
}