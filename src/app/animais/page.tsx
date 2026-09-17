"use client";

import { useState } from "react";

interface Animal {
    id_animal: number;
    nome: string;
    tipo: string;
    raca: string;
    sexo: string;
    data_nascimento: string;
    data_entrada_abrigo: string;
    observacoes: string;
    status: string;
    id_cuidador?: number; // Injetado manualmente pelo nosso workaround no Frontend
}

interface CuidadorResumo {
    id_cuidador: number;
    nome: string;
}

export default function TelaAnimal() {
    const [nome, setNome] = useState("");
    const [tipo, setTipo] = useState("");
    const [raca, setRaca] = useState("");
    const [sexo, setSexo] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [dataEntrada, setDataEntrada] = useState("");
    const [observacoes, setObservacoes] = useState("");
    const [status, setStatus] = useState("ATIVO");
    const [idCuidador, setIdCuidador] = useState("");

    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [animais, setAnimais] = useState<Animal[]>([]);
    const [cuidadoresLista, setCuidadoresLista] = useState<CuidadorResumo[]>([]);
    const [mensagem, setMensagem] = useState("");

    const exibirMensagem = (texto: string) => {
        setMensagem(texto);
        setTimeout(() => {
            setMensagem("");
        }, 4000);
    };

    // CORREÇÃO DO BUG DO DIA A MENOS: Força o horário para 12:00 PM (Meio-dia UTC)
    // Impede que o fuso horário atrase o dia para a noite anterior.
    const prepararDataParaEnvio = (dataStr: string) => {
        if (!dataStr) return "";
        return `${dataStr}T12:00:00Z`;
    };

    const salvarAnimal = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem("Processando...");

        try {
            if (editandoId) {
                // MODO EDIÇÃO (PATCH): Respeitando o Back-end, envia APENAS Status e Cuidador
                const payloadPatch = {
                    status: status.trim().toUpperCase(),
                    id_cuidador: Number(idCuidador)
                };

                const res = await fetch(`/api/animais/${editandoId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payloadPatch),
                });

                const text = await res.text();
                const data = text ? JSON.parse(text) : {};

                if (res.ok) {
                    exibirMensagem("Status e cuidador atualizados com sucesso!");
                    limparFormulario();
                    carregarDadosGlobais();
                } else {
                    exibirMensagem(`Erro ${res.status}: ${data.error || res.statusText}`);
                }

            } else {
                // MODO CRIAÇÃO (POST): Envia a ficha completa
                const payloadPost = {
                    nome: nome.trim(),
                    tipo: tipo.trim().toUpperCase(),
                    raca: raca.trim(),
                    sexo: sexo.trim().toUpperCase(),
                    data_nascimento: prepararDataParaEnvio(dataNascimento),
                    data_entrada_abrigo: prepararDataParaEnvio(dataEntrada),
                    observacoes: observacoes.trim(),
                    id_cuidador: Number(idCuidador)
                };

                const res = await fetch("/api/animais", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payloadPost),
                });

                const text = await res.text();
                const data = text ? JSON.parse(text) : {};

                if (res.ok) {
                    exibirMensagem("Animal cadastrado com sucesso!");
                    limparFormulario();
                    carregarDadosGlobais();
                } else {
                    exibirMensagem(`Erro ${res.status}: ${data.error || res.statusText}`);
                }
            }
        } catch (error: unknown) {
            console.error("Falha na requisição:", error);
            exibirMensagem("Falha na comunicação com o servidor.");
        }
    };

    // Extração cirúrgica de String: Ignora o Timezone do navegador e corta direto no YYYY-MM-DD
    const extrairApenasData = (dataOriginal: string | undefined) => {
        if (!dataOriginal) return "";
        return String(dataOriginal).split('T')[0];
    };

    const iniciarEdicao = (animal: Animal) => {
        setEditandoId(animal.id_animal);
        setNome(animal.nome);
        setTipo(animal.tipo);
        setRaca(animal.raca);
        setSexo(animal.sexo);
        setObservacoes(animal.observacoes || "");
        setStatus(animal.status);

        setIdCuidador(animal.id_cuidador ? animal.id_cuidador.toString() : "");

        // Carregando as datas corretas no input (isento de bugs de fuso horário)
        setDataNascimento(extrairApenasData(animal.data_nascimento));
        setDataEntrada(extrairApenasData(animal.data_entrada_abrigo));
    };

    const limparFormulario = () => {
        setEditandoId(null);
        setNome("");
        setTipo("");
        setRaca("");
        setSexo("");
        setDataNascimento("");
        setDataEntrada("");
        setObservacoes("");
        setStatus("ATIVO");
        setIdCuidador("");
    };

    // A JOGADA DE MESTRE: Como a API esconde o id_cuidador na lista geral, 
    // nós contornamos isso buscando os animais DE CADA CUIDADOR!
    const carregarDadosGlobais = async () => {
        setMensagem("Carregando base de dados...");
        try {
            // 1. Busca Cuidadores
            const resCuidadores = await fetch("/api/cuidadores", { cache: "no-store" });
            if (!resCuidadores.ok) throw new Error("Falha ao buscar cuidadores");

            const dataCuidadores = await resCuidadores.json();
            const cuidadoresMapeados = Array.isArray(dataCuidadores) ? dataCuidadores.map((c: any) => ({
                id_cuidador: c.id_cuidador ?? c._id_cuidador,
                nome: c.nome ?? c._nome
            })) : [];

            setCuidadoresLista(cuidadoresMapeados);

            // 2. Busca Animais vinculados a cada cuidador (Para injetar o ID do dono neles!)
            let todosAnimaisComCuidador: Animal[] = [];

            await Promise.all(cuidadoresMapeados.map(async (cuidador) => {
                const res = await fetch(`/api/animais/cuidador/${cuidador.id_cuidador}`, { cache: "no-store" });
                if (res.ok) {
                    const dataAnimais = await res.json();
                    const animaisDesteCuidador = Array.isArray(dataAnimais) ? dataAnimais.map((a: any) => ({
                        id_animal: a.id_animal ?? a._id_animal,
                        nome: a.nome ?? a._nome,
                        tipo: a.tipo ?? a._tipo,
                        raca: a.raca ?? a._raca,
                        sexo: a.sexo ?? a._sexo,
                        data_nascimento: a.data_nascimento ?? a._data_nascimento,
                        data_entrada_abrigo: a.data_entrada_abrigo ?? a._data_entrada_abrigo,
                        observacoes: a.observacoes ?? a._observacoes,
                        status: a.status ?? a._status,
                        // INJEÇÃO DA INFORMAÇÃO QUE A API ESCONDEU:
                        id_cuidador: cuidador.id_cuidador
                    })) : [];

                    todosAnimaisComCuidador.push(...animaisDesteCuidador);
                }
            }));

            // Organiza a lista final por ID para ficar bonito na tabela
            todosAnimaisComCuidador.sort((a, b) => a.id_animal - b.id_animal);

            setAnimais(todosAnimaisComCuidador);
            exibirMensagem("Lista atualizada com sucesso!");

        } catch (error: unknown) {
            console.error("Falha ao carregar dados:", error);
            exibirMensagem("Falha na comunicação com o servidor.");
        }
    };

    // Formatação visual elegante ("FEMEA" -> "Fêmea")
    const formatarTexto = (texto: string) => {
        if (!texto) return "";
        if (texto === "FEMEA") return "Fêmea";
        if (texto === "EM_ADOCAO") return "Em Adoção";
        return texto.charAt(0) + texto.slice(1).toLowerCase();
    };

    // Formata a data brasileira apenas para a tabela cortando o timezone
    const formatarDataTabela = (dataStr: string | undefined) => {
        const yyyymmdd = extrairApenasData(dataStr);
        if (!yyyymmdd || yyyymmdd.length !== 10) return "N/A";
        const [ano, mes, dia] = yyyymmdd.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    const getNomeCuidador = (id?: number) => {
        if (!id) return "Não Informado";
        const cuidador = cuidadoresLista.find(c => Number(c.id_cuidador) === Number(id));
        return cuidador ? cuidador.nome : `ID ${id}`;
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
                    <h1 className="titulo-principal">Gestão de Animais</h1>
                    <h2 className="subtitulo">{editandoId ? "Editar Status e Cuidador" : "Cadastrar Novo Animal"}</h2>

                    <form onSubmit={salvarAnimal} className="formulario">
                        <input
                            type="text"
                            placeholder="Nome do animal"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            disabled={editandoId !== null}
                        />

                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            required
                            disabled={editandoId !== null}
                        >
                            <option value="" disabled>Selecione a Espécie</option>
                            <option value="CACHORRO">Cachorro</option>
                            <option value="GATO">Gato</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Raça (ex: SRD, Poodle)"
                            value={raca}
                            onChange={(e) => setRaca(e.target.value)}
                            required
                            disabled={editandoId !== null}
                        />

                        <select
                            value={sexo}
                            onChange={(e) => setSexo(e.target.value)}
                            required
                            disabled={editandoId !== null}
                        >
                            <option value="" disabled>Selecione o Sexo</option>
                            <option value="MACHO">Macho</option>
                            <option value="FEMEA">Fêmea</option>
                        </select>

                        <label style={{ fontSize: "0.9rem", color: "var(--texto-mutado)", marginBottom: "-10px" }}>
                            Data de Nascimento (Aproximada)
                        </label>
                        <input
                            type="date"
                            value={dataNascimento}
                            onChange={(e) => setDataNascimento(e.target.value)}
                            required
                            disabled={editandoId !== null}
                        />

                        <label style={{ fontSize: "0.9rem", color: "var(--texto-mutado)", marginBottom: "-10px" }}>
                            Data de Entrada no Abrigo
                        </label>
                        <input
                            type="date"
                            value={dataEntrada}
                            onChange={(e) => setDataEntrada(e.target.value)}
                            required
                            disabled={editandoId !== null}
                        />

                        <input
                            type="text"
                            placeholder="Observações (opcional)"
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                            disabled={editandoId !== null}
                        />

                        {/* Dropdown do Cuidador - Permanece liberado na edição */}
                        <select
                            value={idCuidador}
                            onChange={(e) => setIdCuidador(e.target.value)}
                            required
                            title="Lembre-se: O cuidador tem limite máximo de 10 animais."
                        >
                            <option value="" disabled>
                                {cuidadoresLista.length === 0 ? "Clique em 'Carregar Dados' abaixo..." : "Selecione o Cuidador Responsável"}
                            </option>
                            {cuidadoresLista.map((cuidador) => (
                                <option key={cuidador.id_cuidador} value={cuidador.id_cuidador}>
                                    {cuidador.nome}
                                </option>
                            ))}
                        </select>

                        {/* Status exibido durante a edição - Liberado */}
                        {editandoId && (
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                            >
                                <option value="ATIVO">Status: No Abrigo (Ativo)</option>
                                <option value="EM_ADOCAO">Status: Em Processo de Adoção</option>
                                <option value="ADOTADO">Status: Adotado</option>
                                <option value="FALECIDO">Status: Falecido</option>
                            </select>
                        )}

                        <div className="botoes-form">
                            <button type="submit" className="botao">
                                {editandoId ? "Atualizar Ficha" : "Salvar Animal"}
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
                    <h1 className="titulo-principal">Lista de Animais</h1>

                    <div className="tabela-wrapper">
                        <table className="tabela">
                            <thead>
                                <tr className="tabela-cabecalho">
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Tipo</th>
                                    <th>Sexo</th>
                                    <th>Entrada</th>
                                    <th>Cuidador</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {animais.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="tabela-vazia">
                                            Nenhum animal carregado. Clique no botão abaixo.
                                        </td>
                                    </tr>
                                ) : (
                                    animais.map((a) => {
                                        return (
                                            <tr key={a.id_animal}>
                                                <td>{a.id_animal}</td>
                                                <td>{a.nome}</td>
                                                <td>{formatarTexto(a.tipo)}</td>
                                                <td>{formatarTexto(a.sexo)}</td>
                                                <td>{formatarDataTabela(a.data_entrada_abrigo)}</td>

                                                <td>{getNomeCuidador(a.id_cuidador)}</td>

                                                <td>
                                                    <span style={{
                                                        fontWeight: "600",
                                                        color: a.status === 'ATIVO' ? 'var(--verde-viva)' : 'inherit'
                                                    }}>
                                                        {formatarTexto(a.status)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button onClick={() => iniciarEdicao(a)} className="botao-editar">
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

                    <button onClick={carregarDadosGlobais} className="botao-atualizar">
                        Carregar Dados / Atualizar Tabela
                    </button>
                </section>
            </div>
        </div>
    );
}