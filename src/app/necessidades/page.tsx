"use client";

import { useState } from "react";

interface Necessidade {
    id_necessidade: number;
    descricao: string;
    observacoes: string;
    ativa: boolean;
    id_animal?: number;
}

interface AnimalResumo {
    id_animal: number;
    nome: string;
}

export default function TelaNecessidade() {
    const [idAnimal, setIdAnimal] = useState("");
    const [descricao, setDescricao] = useState("");
    const [observacoes, setObservacoes] = useState("");
    const [ativa, setAtiva] = useState("true");

    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [necessidades, setNecessidades] = useState<Necessidade[]>([]);
    const [animaisLista, setAnimaisLista] = useState<AnimalResumo[]>([]);
    const [mensagem, setMensagem] = useState("");

    const exibirMensagem = (texto: string) => {
        setMensagem(texto);
        setTimeout(() => {
            setMensagem("");
        }, 4000);
    };

    const salvarNecessidade = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem("Processando...");

        try {
            const method = editandoId ? "PUT" : "POST";
            const url = editandoId ? `/api/necessidades/${editandoId}` : "/api/necessidades";

            const payload = {
                descricao: descricao.trim(),
                observacoes: observacoes.trim(),
                ativa: ativa === "true",
                id_animal: Number(idAnimal)
            };

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const text = await res.text();
            const data = text ? JSON.parse(text) : {};

            if (res.ok) {
                exibirMensagem(editandoId ? "Necessidade atualizada com sucesso!" : "Necessidade registrada com sucesso!");
                limparFormulario();
                carregarDadosGlobais();
            } else {
                exibirMensagem(`Erro ${res.status}: ${data.error || res.statusText}`);
            }
        } catch (error: unknown) {
            console.error("Falha na requisição:", error);
            exibirMensagem("Falha na comunicação com o servidor.");
        }
    };

    const iniciarEdicao = (necessidade: Necessidade) => {
        setEditandoId(necessidade.id_necessidade);
        setDescricao(necessidade.descricao);
        setObservacoes(necessidade.observacoes || "");
        setAtiva(necessidade.ativa ? "true" : "false");
        setIdAnimal(necessidade.id_animal ? necessidade.id_animal.toString() : "");
    };

    const limparFormulario = () => {
        setEditandoId(null);
        setIdAnimal("");
        setDescricao("");
        setObservacoes("");
        setAtiva("true");
    };

    const carregarDadosGlobais = async () => {
        setMensagem("Carregando prontuários e base de animais...");
        try {
            const resAnimais = await fetch("/api/animais", { cache: "no-store" });
            if (!resAnimais.ok) throw new Error("Falha ao buscar animais base");

            const dataAnimais = await resAnimais.json();
            const animaisMapeados = Array.isArray(dataAnimais) ? dataAnimais.map((a: any) => ({
                id_animal: a.id_animal ?? a._id_animal,
                nome: a.nome ?? a._nome
            })) : [];

            setAnimaisLista(animaisMapeados);

            let todasNecessidadesExtraidas: Necessidade[] = [];

            await Promise.all(animaisMapeados.map(async (animal) => {
                const res = await fetch(`/api/animais/${animal.id_animal}`, { cache: "no-store" });
                if (res.ok) {
                    const animalCompleto = await res.json();
                    const listaNec = animalCompleto.necessidades || animalCompleto._necessidades;

                    if (listaNec && Array.isArray(listaNec)) {
                        const necDesteAnimal = listaNec.map((n: any) => ({
                            id_necessidade: n.id_necessidade ?? n._id_necessidade,
                            descricao: n.descricao ?? n._descricao,
                            observacoes: n.observacoes ?? n._observacoes,
                            ativa: n.ativa ?? n._ativa ?? true,
                            id_animal: animal.id_animal
                        }));
                        todasNecessidadesExtraidas.push(...necDesteAnimal);
                    }
                }
            }));

            todasNecessidadesExtraidas.sort((a, b) => Number(b.ativa) - Number(a.ativa));

            setNecessidades(todasNecessidadesExtraidas);
            exibirMensagem("Prontuários e necessidades atualizados!");

        } catch (error: unknown) {
            console.error("Falha ao carregar dados:", error);
            exibirMensagem("Falha na comunicação com o servidor.");
        }
    };

    const getNomeAnimal = (id?: number) => {
        if (!id) return "Animal Desconhecido";
        const animal = animaisLista.find(a => Number(a.id_animal) === Number(id));
        return animal ? animal.nome : `ID ${id}`;
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
                    <h1 className="titulo-principal">Gestão de Necessidades</h1>
                    <h2 className="subtitulo">{editandoId ? "Editar Necessidade" : "Registrar Nova Necessidade"}</h2>

                    <form onSubmit={salvarNecessidade} className="formulario">

                        <select
                            value={idAnimal}
                            onChange={(e) => setIdAnimal(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                {animaisLista.length === 0 ? "Clique em 'Carregar Dados' abaixo..." : "Selecione o Animal Paciente"}
                            </option>
                            {animaisLista.map((animal) => (
                                <option key={animal.id_animal} value={animal.id_animal}>
                                    {animal.nome}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Descrição (Ex: Vacina V10, Cirurgia Castração)"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Observações (Ex: Necessário jejum de 8h)"
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                        />

                        <select
                            value={ativa}
                            onChange={(e) => setAtiva(e.target.value)}
                            required
                        >
                            <option value="true">Status: PENDENTE (Ativa)</option>
                            <option value="false">Status: RESOLVIDA (Inativa)</option>
                        </select>

                        <div className="botoes-form">
                            <button type="submit" className="botao">
                                {editandoId ? "Atualizar Registro" : "Salvar Necessidade"}
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
                    <h1 className="titulo-principal">Prontuário de Necessidades</h1>

                    <div className="tabela-wrapper">
                        <table className="tabela">
                            <thead>
                                <tr className="tabela-cabecalho">
                                    <th>Cód.</th>
                                    <th>Paciente (Animal)</th>
                                    <th>Descrição / Tarefa</th>
                                    <th>Observações</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {necessidades.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="tabela-vazia">
                                            Nenhum registro encontrado. Clique no botão abaixo.
                                        </td>
                                    </tr>
                                ) : (
                                    necessidades.map((nec) => {
                                        return (
                                            <tr key={nec.id_necessidade}>
                                                <td>{nec.id_necessidade}</td>
                                                <td><span style={{ fontWeight: "bold" }}>{getNomeAnimal(nec.id_animal)}</span></td>
                                                <td>{nec.descricao}</td>
                                                <td style={{ fontSize: "0.85rem", color: "var(--texto-mutado)" }}>
                                                    {nec.observacoes || "-"}
                                                </td>
                                                <td>
                                                    <span style={{
                                                        fontWeight: "600",
                                                        padding: "4px 8px",
                                                        borderRadius: "4px",
                                                        backgroundColor: nec.ativa ? "rgba(255, 99, 71, 0.1)" : "rgba(39, 174, 96, 0.1)",
                                                        color: nec.ativa ? "var(--coral-viva)" : "var(--verde-viva)"
                                                    }}>
                                                        {nec.ativa ? "Pendente" : "Resolvida"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button onClick={() => iniciarEdicao(nec)} className="botao-editar">
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