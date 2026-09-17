"use client";

import { useState } from "react";

interface ItemDoacao {
    id_suprimento: number;
    quantidade: number;
    data_validade: string;
    observacoes?: string;
}

interface Doacao {
    id_doacao: number;
    id_doador: number;
    itens: ItemDoacao[];
    data_doacao: string;
}

interface DoadorResumo {
    id_doador: number;
    nome: string;
}

interface SuprimentoResumo {
    id_suprimento: number;
    nome: string;
}

export default function TelaDoacao() {
    const [idDoador, setIdDoador] = useState("");
    const [dataDoacao, setDataDoacao] = useState("");

    // Estados para gerenciar a adição de múltiplos itens
    const [idSuprimentoSelecionado, setIdSuprimentoSelecionado] = useState("");
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState("");
    const [validadeSelecionada, setValidadeSelecionada] = useState("");
    const [itensDoacao, setItensDoacao] = useState<ItemDoacao[]>([]);

    // Histórico local (Sessão atual)
    const [doacoesSessao, setDoacoesSessao] = useState<Doacao[]>([]);

    // Listas auxiliares (Dropdowns)
    const [doadoresLista, setDoadoresLista] = useState<DoadorResumo[]>([]);
    const [suprimentosLista, setSuprimentosLista] = useState<SuprimentoResumo[]>([]);
    const [mensagem, setMensagem] = useState("");

    const exibirMensagem = (texto: string) => {
        setMensagem(texto);
        setTimeout(() => {
            setMensagem("");
        }, 4000);
    };

    const adicionarItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!idSuprimentoSelecionado || !quantidadeSelecionada || !validadeSelecionada) {
            exibirMensagem("Preencha o suprimento, a quantidade e a validade do lote!");
            return;
        }

        const novoItem: ItemDoacao = {
            id_suprimento: Number(idSuprimentoSelecionado),
            quantidade: Number(quantidadeSelecionada),
            data_validade: validadeSelecionada
        };

        setItensDoacao([...itensDoacao, novoItem]);
        setIdSuprimentoSelecionado("");
        setQuantidadeSelecionada("");
        setValidadeSelecionada("");
    };

    const removerItem = (index: number) => {
        const novaLista = itensDoacao.filter((_, i) => i !== index);
        setItensDoacao(novaLista);
    };

    const salvarDoacao = async (e: React.FormEvent) => {
        e.preventDefault();

        if (itensDoacao.length === 0) {
            exibirMensagem("Adicione pelo menos um item à doação!");
            return;
        }

        setMensagem("Processando registro no estoque...");

        const payload = {
            id_doador: Number(idDoador),
            data_doacao: dataDoacao,
            itens: itensDoacao
        };

        try {
            const res = await fetch("/api/doacoes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const text = await res.text();
            const data = text ? JSON.parse(text) : {};

            if (res.ok) {
                exibirMensagem("Doação registrada com sucesso! Estoque atualizado.");

                // Mapeamento tolerante para aceitar o retorno da classe (com underline) 
                // ou fazer fallback para o que acabou de ser digitado no payload
                const itensRetornados = data.itens || data._itens || payload.itens || [];
                const itensMapeados = itensRetornados.map((it: any) => ({
                    id_suprimento: it.id_suprimento ?? it._id_suprimento,
                    quantidade: it.quantidade ?? it._quantidade,
                    data_validade: it.data_validade ?? it._data_validade
                }));

                const novaDoacaoMapeada: Doacao = {
                    id_doacao: data.id_doacao ?? data._id_doacao ?? 0,
                    id_doador: data.id_doador ?? data._id_doador ?? payload.id_doador,
                    data_doacao: data.data_doacao ?? data._data_doacao ?? payload.data_doacao,
                    itens: itensMapeados
                };

                setDoacoesSessao(prev => [novaDoacaoMapeada, ...prev]);
                limparFormulario();
            } else {
                exibirMensagem(`Erro ${res.status}: ${data.error || "Falha na transação"}`);
            }
        } catch (error: unknown) {
            console.error("Falha na requisição:", error);
            exibirMensagem("Falha na comunicação com o servidor.");
        }
    };

    const limparFormulario = () => {
        setIdDoador("");
        setDataDoacao("");
        setItensDoacao([]);
        setIdSuprimentoSelecionado("");
        setQuantidadeSelecionada("");
        setValidadeSelecionada("");
    };

    const carregarListas = async () => {
        setMensagem("Carregando base de doadores e suprimentos...");
        try {
            const [resDoadores, resSuprimentos] = await Promise.all([
                fetch("/api/doadores", { cache: "no-store" }),
                fetch("/api/suprimentos", { cache: "no-store" })
            ]);

            if (resDoadores.ok) {
                const dataDoadores = await resDoadores.json();
                setDoadoresLista(Array.isArray(dataDoadores) ? dataDoadores.map((d: any) => ({
                    id_doador: d.id_doador ?? d._id_doador,
                    nome: d.nome ?? d._nome
                })) : []);
            }

            if (resSuprimentos.ok) {
                const dataSuprimentos = await resSuprimentos.json();
                setSuprimentosLista(Array.isArray(dataSuprimentos) ? dataSuprimentos.map((s: any) => ({
                    id_suprimento: s.id_suprimento ?? s._id_suprimento,
                    nome: s.nome ?? s._nome
                })) : []);
            }

            exibirMensagem("Dados carregados com sucesso! Tela pronta para uso.");
        } catch (error) {
            console.error("Falha ao carregar listas auxiliares:", error);
            exibirMensagem("Falha ao carregar dados do servidor.");
        }
    };

    const getNomeDoador = (id: number) => {
        const doador = doadoresLista.find(d => d.id_doador === Number(id));
        return doador ? doador.nome : `Doador ID ${id}`;
    };

    const getNomeSuprimento = (id: number) => {
        const suprimento = suprimentosLista.find(s => s.id_suprimento === Number(id));
        return suprimento ? suprimento.nome : `Item ID ${id}`;
    };

    return (
        <div className="container">
            {mensagem && (
                <div className="alerta">
                    <strong>Status:</strong> {mensagem}
                </div>
            )}

            <div className="layout-duplo">
                <section className="coluna-form">
                    <h1 className="titulo-principal">Transação de Doação</h1>
                    <h2 className="subtitulo">Registrar Entrada no Estoque</h2>

                    <form onSubmit={salvarDoacao} className="formulario">

                        <select
                            value={idDoador}
                            onChange={(e) => setIdDoador(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                {doadoresLista.length === 0 ? "Clique em 'Carregar Dados' abaixo..." : "Selecione o Doador"}
                            </option>
                            {doadoresLista.map((doador) => (
                                <option key={doador.id_doador} value={doador.id_doador}>
                                    {doador.nome}
                                </option>
                            ))}
                        </select>

                        <label style={{ fontSize: "0.9rem", color: "var(--texto-mutado)", marginBottom: "-10px" }}>
                            Data do Recebimento
                        </label>
                        <input
                            type="date"
                            value={dataDoacao}
                            onChange={(e) => setDataDoacao(e.target.value)}
                            required
                        />

                        {/* Bloco de Adição de Itens com Validade */}
                        <div style={{ border: "1px dashed var(--roxo-viva)", padding: "15px", borderRadius: "8px", marginTop: "5px" }}>
                            <h3 style={{ fontSize: "1rem", color: "var(--roxo-viva)", marginTop: 0, marginBottom: "10px" }}>
                                Itens Recebidos
                            </h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
                                <select
                                    value={idSuprimentoSelecionado}
                                    onChange={(e) => setIdSuprimentoSelecionado(e.target.value)}
                                >
                                    <option value="" disabled>Selecione o Suprimento</option>
                                    {suprimentosLista.map((suprimento) => (
                                        <option key={suprimento.id_suprimento} value={suprimento.id_suprimento}>
                                            {suprimento.nome}
                                        </option>
                                    ))}
                                </select>

                                <div style={{ display: "flex", gap: "10px" }}>
                                    <input
                                        type="number"
                                        placeholder="Qtd"
                                        value={quantidadeSelecionada}
                                        onChange={(e) => setQuantidadeSelecionada(e.target.value)}
                                        style={{ flex: 1 }}
                                        min="1"
                                        step="1"
                                    />

                                    <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
                                        <span style={{ fontSize: "0.75rem", color: "var(--texto-mutado)", marginBottom: "2px" }}>Validade do Lote</span>
                                        <input
                                            type="date"
                                            value={validadeSelecionada}
                                            onChange={(e) => setValidadeSelecionada(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={adicionarItem}
                                    style={{
                                        backgroundColor: "var(--verde-viva)",
                                        color: "#144627",
                                        border: "none",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        marginTop: "5px"
                                    }}
                                >
                                    + Adicionar Item à Lista
                                </button>
                            </div>

                            {/* Lista visual dos itens adicionados antes do envio */}
                            {itensDoacao.length === 0 ? (
                                <p style={{ fontSize: "0.85rem", color: "var(--texto-mutado)", fontStyle: "italic", margin: 0 }}>
                                    Nenhum item na lista ainda.
                                </p>
                            ) : (
                                <ul style={{ paddingLeft: "20px", margin: "5px 0 0 0", fontSize: "0.85rem" }}>
                                    {itensDoacao.map((item, index) => {
                                        const validadeFormatada = item.data_validade
                                            ? new Date(item.data_validade).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                                            : '';

                                        return (
                                            <li key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", borderBottom: "1px solid #eee", paddingBottom: "4px" }}>
                                                <span>
                                                    {getNomeSuprimento(item.id_suprimento)}: <strong>Qtd: {item.quantidade}</strong> (Val: {validadeFormatada})
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removerItem(index)}
                                                    style={{ background: "none", border: "none", color: "var(--coral-viva)", cursor: "pointer", fontWeight: "bold" }}
                                                >
                                                    ✕
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        <div className="botoes-form">
                            <button
                                type="submit"
                                className="botao"
                                disabled={doadoresLista.length === 0}
                            >
                                Registrar Doação
                            </button>
                        </div>
                    </form>
                </section>

                <section className="coluna-lista">
                    <h1 className="titulo-principal">Doações Registradas</h1>
                    <h2 className="subtitulo" style={{ marginBottom: "15px" }}>Nesta Sessão</h2>

                    <div className="tabela-wrapper">
                        <table className="tabela">
                            <thead>
                                <tr className="tabela-cabecalho">
                                    <th>Cód. Transação</th>
                                    <th>Doador</th>
                                    <th>Itens Doados</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doacoesSessao.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="tabela-vazia">
                                            Nenhum registro efetuado nesta sessão.
                                        </td>
                                    </tr>
                                ) : (
                                    doacoesSessao.map((d, index) => (
                                        <tr key={index}>
                                            <td><span style={{ fontWeight: "bold" }}>{d.id_doacao}</span></td>
                                            <td>{getNomeDoador(d.id_doador)}</td>
                                            <td>
                                                {d.itens && Array.isArray(d.itens) && d.itens.length > 0 ? (
                                                    <ul style={{ paddingLeft: "15px", margin: 0, fontSize: "0.9rem" }}>
                                                        {d.itens.map((it, idx) => (
                                                            <li key={idx}>
                                                                {getNomeSuprimento(it.id_suprimento)}: <strong style={{ color: "var(--verde-viva)" }}>+{it.quantidade}</strong>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <span>Nenhum detalhe mapeado</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <button onClick={carregarListas} className="botao-atualizar">
                        Carregar Base de Doadores e Suprimentos
                    </button>
                </section>
            </div>
        </div>
    );
}