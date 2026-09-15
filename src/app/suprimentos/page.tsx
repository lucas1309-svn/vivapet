"use client";

import { useState } from "react";
import "./suprimento.css";

interface Suprimento {
    id_suprimento: number;
    nome: string;
    unidade: string;
    quantidade_estoque: number;
    quantidade_minima: number;
    ativo: boolean;
}

export default function TelaSuprimento() {
    const [nome, setNome] = useState("");
    const [unidade, setUnidade] = useState("");
    const [quantidadeEstoque, setQuantidadeEstoque] = useState("");
    const [quantidadeMinima, setQuantidadeMinima] = useState("");
    const [ativo, setAtivo] = useState(true);

    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [suprimentos, setSuprimentos] = useState<Suprimento[]>([]);
    const [mensagem, setMensagem] = useState("");

    const exibirMensagem = (texto: string) => {
        setMensagem(texto);
        setTimeout(() => {
            setMensagem("");
        }, 3000);
    };

    const salvarSuprimento = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem("Processando...");

        const method = editandoId ? "PUT" : "POST";
        const url = editandoId ? `/api/suprimentos/${editandoId}` : "/api/suprimentos";

        // Converte as strings para números para envio ao backend
        const payload = editandoId
            ? {
                id_suprimento: editandoId,
                nome,
                unidade,
                quantidade_estoque: Number(quantidadeEstoque),
                quantidade_minima: Number(quantidadeMinima),
                ativo
            }
            : {
                nome,
                unidade,
                quantidade_estoque: Number(quantidadeEstoque),
                quantidade_minima: Number(quantidadeMinima)
            };

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const text = await res.text();
            const data = text ? JSON.parse(text) : {};

            if (res.ok) {
                exibirMensagem(editandoId ? "Suprimento atualizado com sucesso!" : "Suprimento cadastrado com sucesso!");
                limparFormulario();
                carregarLista();
            } else {
                exibirMensagem(`Erro ${res.status}: ${data.error || res.statusText}`);
            }
        } catch (error: unknown) {
            console.error("Falha na requisição:", error);
            const msgErro = error instanceof Error ? error.message : "Erro desconhecido";
            exibirMensagem(`Falha na comunicação com o servidor: ${msgErro}`);
        }
    };

    const iniciarEdicao = (suprimento: Suprimento) => {
        setEditandoId(suprimento.id_suprimento);
        setNome(suprimento.nome);
        setUnidade(suprimento.unidade);
        setQuantidadeEstoque(suprimento.quantidade_estoque.toString());
        setQuantidadeMinima(suprimento.quantidade_minima.toString());
        setAtivo(suprimento.ativo);
    };

    const limparFormulario = () => {
        setEditandoId(null);
        setNome("");
        setUnidade("");
        setQuantidadeEstoque("");
        setQuantidadeMinima("");
        setAtivo(true);
    };

    const carregarLista = async () => {
        setMensagem("Buscando suprimentos...");
        try {
            const res = await fetch("/api/suprimentos", {
                cache: "no-store"
            });

            const text = await res.text();
            const data = text ? JSON.parse(text) : {};

            if (res.ok) {
                const listaMapeada = Array.isArray(data) ? data.map((s: any) => ({
                    id_suprimento: s.id_suprimento || s._id_suprimento,
                    nome: s.nome || s._nome,
                    unidade: s.unidade || s._unidade,
                    quantidade_estoque: s.quantidade_estoque !== undefined ? s.quantidade_estoque : s._quantidade_estoque,
                    quantidade_minima: s.quantidade_minima !== undefined ? s.quantidade_minima : s._quantidade_minima,
                    ativo: s.ativo !== undefined ? s.ativo : s._ativo
                })) : [];

                setSuprimentos(listaMapeada);
                exibirMensagem("Lista atualizada!");
            } else {
                exibirMensagem(`Erro: ${data.error || "Falha na busca"}`);
            }
        } catch (error: unknown) {
            console.error("Falha na requisição de busca:", error);
            const msgErro = error instanceof Error ? error.message : "Erro desconhecido";
            exibirMensagem(`Falha ao buscar os dados: ${msgErro}`);
        }
    };

    return (
        <div className="container">
            {mensagem && (
                <div className="alerta">
                    <strong>Aviso:</strong> {mensagem}
                </div>
            )}

            <div className="layout-duplo">
                <section className="coluna-form">
                    <h1 className="titulo-principal">Gestão de Suprimentos</h1>
                    <h2 className="subtitulo">{editandoId ? "Editar Suprimento" : "Cadastrar Novo"}</h2>

                    <form onSubmit={salvarSuprimento} className="formulario">
                        <input
                            type="text"
                            placeholder="Nome do produto (ex: Ração Premier)"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Unidade (ex: kg, pacote, litro)"
                            value={unidade}
                            onChange={(e) => setUnidade(e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Quantidade em Estoque"
                            value={quantidadeEstoque}
                            onChange={(e) => setQuantidadeEstoque(e.target.value)}
                            required
                            min="0"
                            step="any"
                        />
                        <input
                            type="number"
                            placeholder="Quantidade Mínima (Alerta)"
                            value={quantidadeMinima}
                            onChange={(e) => setQuantidadeMinima(e.target.value)}
                            required
                            min="0"
                            step="any"
                        />

                        {editandoId && (
                            <select
                                value={ativo ? "true" : "false"}
                                onChange={(e) => setAtivo(e.target.value === "true")}
                                style={{
                                    padding: "12px 16px",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc",
                                    backgroundColor: "var(--fundo-branco)",
                                    fontSize: "1rem",
                                    outline: "none",
                                    cursor: "pointer"
                                }}
                            >
                                <option value="true">Status: Ativo</option>
                                <option value="false">Status: Inativo</option>
                            </select>
                        )}

                        <div className="botoes-form">
                            <button type="submit" className="botao">
                                {editandoId ? "Atualizar Suprimento" : "Salvar Suprimento"}
                            </button>
                            {editandoId && (
                                <button type="button" onClick={limparFormulario} className="botao-cancelar">
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="coluna-lista">
                    <h1 className="titulo-principal">Lista de Suprimentos</h1>

                    <div className="tabela-wrapper">
                        <table className="tabela">
                            <thead>
                                <tr className="tabela-cabecalho">
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Unidade</th>
                                    <th>Estoque Atual</th>
                                    <th>Estoque Mín.</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suprimentos.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="tabela-vazia">
                                            Nenhum suprimento carregado. Clique no botão abaixo.
                                        </td>
                                    </tr>
                                ) : (
                                    suprimentos.map((s) => {
                                        const alertaEstoque = s.quantidade_estoque < s.quantidade_minima;

                                        return (
                                            <tr key={s.id_suprimento}>
                                                <td>{s.id_suprimento}</td>
                                                <td>{s.nome}</td>
                                                <td>{s.unidade}</td>
                                                <td style={{
                                                    color: alertaEstoque ? "var(--coral-viva)" : "inherit",
                                                    fontWeight: alertaEstoque ? "bold" : "normal"
                                                }}>
                                                    {s.quantidade_estoque}
                                                </td>
                                                <td>{s.quantidade_minima}</td>
                                                <td>{s.ativo ? "Ativo" : "Inativo"}</td>
                                                <td>
                                                    <button onClick={() => iniciarEdicao(s)} className="botao-editar">
                                                        Editar
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <button onClick={carregarLista} className="botao-atualizar">
                        Carregar / Atualizar Tabela
                    </button>
                </section>
            </div>
        </div>
    );
}