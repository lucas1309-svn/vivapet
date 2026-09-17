"use client";

import { useState } from "react";

interface Cuidador {
    id_cuidador: number;
    nome: string;
    cpf: string;
    email: string;
    ativo: boolean;
}

export default function TelaCuidador() {

    // PREPARAÇÃO PARA O CONTROLE DOS CAMPOS DA TELA COM USESTATE
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");

    // STATUS PADRÃO PARA CUMPRIMENTO DA INTERFACE
    const [ativo, setAtivo] = useState(true);

    const [editandoId, setEditandoId] = useState<number | null>(null);

    // ARRAY RESPONSÁVEL PELA LISTAGEM NA TELA
    const [cuidadores, setCuidadores] = useState<Cuidador[]>([]);

    // MENSAGENS DE AVISO
    const [mensagem, setMensagem] = useState(""); 



    // FUNÇÃO QUE DISPARA MENSAGENS DE ALERTA NO TOPO DA TELA, PASSANDO O TEXTO DE AVISO COMO PARÂMETRO, CONTA 3 SEGUNDOS E APARA A MENSAGEM (ATRIBUINDO VALOR VAZIO "" ).
    const exibirMensagem = (texto: string) => {
        setMensagem(texto);
        setTimeout(() => {
            setMensagem("");
        }, 3000);
    };



    // MÉTODO QUE SALVA OS DADOS DE UM CUIDADOR NO SISTEMA, SEJA POR INSERÇÃO DE NOVO REGISTRO OU POR ALTERAÇÃO EM UM REGISTRO JÁ EXISTENTE
    const salvarCuidador = async (e: React.FormEvent) => {

        // O PREVENT DEFAULT SEGURA A TELA SEM PRECISAR DE UM RECARREGAMENTO PELO SERVIDOR
        e.preventDefault();
        setMensagem("Processando..."); // PASSANDO A MENSAGEM QUE SUMIRÁ EM 3 SEGUNDOS


        // A PARTIR DO ID, O SISTEMA SABE SE CHAMA A FUNÇÃO POST (PARA CRIAÇÃO DE UM NOVO CUIDADOR) OU PUT (PARA EDIÇÃO DE UM CUIDADOR EXISTENTE), POIS SÓ EXISTE ID SE JÁ EXISTIR REGISTRO NO BANCO DE DADOS!
        const method = editandoId ? "PUT" : "POST";
        const url = editandoId ? `/api/cuidadores/${editandoId}` : "/api/cuidadores";


        // FAZENDO O CARREGAMENTO DO CUIDADOR, VISANDO A EDIÇÃO EM MEMÓRIA DOS CAMPOS, INCLUINDO O CAMPO ATIVO
        const payload = editandoId
            ? { id_cuidador: editandoId, nome, cpf, email, ativo }
            : { nome, cpf, email };

        
        

        // INÍCIO DO PROCESSAMENTO:



        try {

            // UTILIZANDO OS MÉTODOS DA FETCH API NATIVA PARA GERAR AS REQUISIÇÕES JSON
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload), // CONVERTENDO OS DADOS DO OBJETO PARA TEXTO ATRAVÉS DO JSON
            });

            const text = await res.text();
            const data = text ? JSON.parse(text) : {}; // CONVERTENDO OS TEXTOS PARA OBJETOS ATRAVÉS DO JSON

            if (res.ok) {
                exibirMensagem(editandoId ? "Cuidador atualizado com sucesso!" : "Cuidador cadastrado com sucesso!");
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

    const iniciarEdicao = (cuidador: Cuidador) => {
        setEditandoId(cuidador.id_cuidador);
        setNome(cuidador.nome);
        setCpf(cuidador.cpf);
        setEmail(cuidador.email);
        setAtivo(cuidador.ativo); // Puxa o status atual do registro
    };

    const limparFormulario = () => {
        setEditandoId(null);
        setNome("");
        setCpf("");
        setEmail("");
        setAtivo(true); // Reseta para o default
    };

    const carregarLista = async () => {
        setMensagem("Buscando cuidadores...");
        try {
            const res = await fetch("/api/cuidadores", {
                cache: "no-store"
            });

            const text = await res.text();
            const data = text ? JSON.parse(text) : {};

            if (res.ok) {
                const listaMapeada = Array.isArray(data) ? data.map((c: any) => ({
                    id_cuidador: c.id_cuidador || c._id_cuidador,
                    nome: c.nome || c._nome,
                    cpf: c.cpf || c._cpf,
                    email: c.email || c._email,
                    ativo: c.ativo !== undefined ? c.ativo : c._ativo
                })) : [];

                setCuidadores(listaMapeada);
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
                    <h1 className="titulo-principal">Gestão de Cuidadores</h1>
                    <h2 className="subtitulo">{editandoId ? "Editar Cuidador" : "Cadastrar Novo"}</h2>

                    <form onSubmit={salvarCuidador} className="formulario">
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

                        {/* Renderização condicional: Só aparece se estiver editando */}
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
                                {editandoId ? "Atualizar Cuidador" : "Salvar Cuidador"}
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
                    <h1 className="titulo-principal">Lista de Cuidadores</h1>

                    <div className="tabela-wrapper">
                        <table className="tabela">
                            <thead>
                                <tr className="tabela-cabecalho">
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>CPF</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cuidadores.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="tabela-vazia">
                                            Nenhum cuidador carregado. Clique no botão abaixo.
                                        </td>
                                    </tr>
                                ) : (
                                    cuidadores.map((c) => (
                                        <tr key={c.id_cuidador}>
                                            <td>{c.id_cuidador}</td>
                                            <td>{c.nome}</td>
                                            <td>{c.cpf}</td>
                                            <td>{c.ativo ? "Ativo" : "Inativo"}</td>
                                            <td>
                                                <button onClick={() => iniciarEdicao(c)} className="botao-editar">
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