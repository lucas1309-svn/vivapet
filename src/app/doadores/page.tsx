"use client";

import { useState } from "react";
import "./doador.css";

interface Doador {
    id_doador: number;
    nome: string;
    cpf: string;
    email: string;
}

export default function TelaDoador() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");

    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [doadores, setDoadores] = useState<Doador[]>([]);
    const [mensagem, setMensagem] = useState("");

    const exibirMensagem = (texto: string) => {
        setMensagem(texto);
        setTimeout(() => {
            setMensagem("");
        }, 3000);
    };

    const salvarDoador = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem("Processando...");

        const method = editandoId ? "PUT" : "POST";
        const url = editandoId ? `/api/doadores/${editandoId}` : "/api/doadores";

        const payload = editandoId
            ? { id_doador: editandoId, nome, cpf, email }
            : { nome, cpf, email };

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const text = await res.text();
            const data = text ? JSON.parse(text) : {};

            if (res.ok) {
                exibirMensagem(editandoId ? "Doador atualizado com sucesso!" : "Doador cadastrado com sucesso!");
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

    const iniciarEdicao = (doador: Doador) => {
        setEditandoId(doador.id_doador);
        setNome(doador.nome);
        setCpf(doador.cpf);
        setEmail(doador.email);
    };

    const limparFormulario = () => {
        setEditandoId(null);
        setNome("");
        setCpf("");
        setEmail("");
    };

    const carregarLista = async () => {
        setMensagem("Buscando doadores...");
        try {
            const res = await fetch("/api/doadores", {
                cache: "no-store"
            });

            const text = await res.text();
            const data = text ? JSON.parse(text) : {};

            if (res.ok) {
                const listaMapeada = Array.isArray(data) ? data.map((d: any) => ({
                    id_doador: d.id_doador || d._id_doador,
                    nome: d.nome || d._nome,
                    cpf: d.cpf || d._cpf,
                    email: d.email || d._email
                })) : [];

                setDoadores(listaMapeada);
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
                    <h1 className="titulo-principal">Gestão de Doadores</h1>
                    <h2 className="subtitulo">{editandoId ? "Editar Doador" : "Cadastrar Novo"}</h2>

                    <form onSubmit={salvarDoador} className="formulario">
                        <input
                            type="text"
                            placeholder="Nome completo"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="CPF (apenas números)"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className="botoes-form">
                            <button type="submit" className="botao">
                                {editandoId ? "Atualizar Doador" : "Salvar Doador"}
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
                    <h1 className="titulo-principal">Lista de Doadores</h1>

                    <div className="tabela-wrapper">
                        <table className="tabela">
                            <thead>
                                <tr className="tabela-cabecalho">
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>CPF</th>
                                    <th>E-mail</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doadores.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="tabela-vazia">
                                            Nenhum doador carregado. Clique no botão abaixo.
                                        </td>
                                    </tr>
                                ) : (
                                    doadores.map((d) => (
                                        <tr key={d.id_doador}>
                                            <td>{d.id_doador}</td>
                                            <td>{d.nome}</td>
                                            <td>{d.cpf}</td>
                                            <td>{d.email}</td>
                                            <td>
                                                <button onClick={() => iniciarEdicao(d)} className="botao-editar">
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
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