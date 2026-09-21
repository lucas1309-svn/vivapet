"use client";

import { useState, useMemo } from "react";

interface RegistroUsoSessao {
    id_registro_uso: number;
    id_cuidador: number;
    id_animal: number;
    id_suprimento: number;
    quantidade_usada: number;
    necessidade_resolvida?: string;
}

interface CuidadorResumo {
    id_cuidador: number;
    nome: string;
}

interface AnimalResumo {
    id_animal: number;
    nome: string;
    id_cuidador?: number;
}

interface SuprimentoResumo {
    id_suprimento: number;
    nome: string;
    estoque: number;
    unidade: string;
}

interface Necessidade {
    id_necessidade: number;
    descricao: string;
    observacoes: string;
    ativa: boolean;
    id_animal: number;
}

export default function TelaRegistroUso() {
    // Estados do Formulário
    const [idCuidador, setIdCuidador] = useState("");
    const [idAnimal, setIdAnimal] = useState("");
    const [idNecessidade, setIdNecessidade] = useState("");
    const [idSuprimento, setIdSuprimento] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [observacoes, setObservacoes] = useState("");

    // Listas de Dados
    const [cuidadoresLista, setCuidadoresLista] = useState<CuidadorResumo[]>([]);
    const [animaisLista, setAnimaisLista] = useState<AnimalResumo[]>([]);
    const [suprimentosLista, setSuprimentosLista] = useState<SuprimentoResumo[]>([]);
    const [necessidadesLista, setNecessidadesLista] = useState<Necessidade[]>([]);

    // Histórico da Sessão
    const [registrosSessao, setRegistrosSessao] = useState<RegistroUsoSessao[]>([]);
    const [mensagem, setMensagem] = useState("");

    const exibirMensagem = (texto: string) => {
        setMensagem(texto);
        setTimeout(() => {
            setMensagem("");
        }, 5000);
    };

    const necessidadesDoAnimal = useMemo(() => {
        if (!idAnimal) return [];
        return necessidadesLista.filter(n => n.id_animal === Number(idAnimal) && n.ativa);
    }, [idAnimal, necessidadesLista]);

    const salvarRegistro = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!idCuidador) {
            exibirMensagem("Erro: O animal selecionado não possui um cuidador vinculado no sistema.");
            return;
        }

        setMensagem("Processando transação no estoque...");

        const payloadRegistro = {
            quantidade_usada: Number(quantidade),
            observacoes: observacoes.trim(),
            id_cuidador: Number(idCuidador),
            id_animal: Number(idAnimal),
            id_suprimento: Number(idSuprimento)
        };

        try {
            // 1. DISPARA A TRANSAÇÃO DE ESTOQUE
            const resRegistro = await fetch("/api/registros-uso", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadRegistro),
            });

            const textRegistro = await resRegistro.text();
            const dataRegistro = textRegistro ? JSON.parse(textRegistro) : {};

            if (!resRegistro.ok) {
                exibirMensagem(`Erro no estoque: ${dataRegistro.error || resRegistro.statusText}`);
                return;
            }

            let necessidadeFechada = "Uso Avulso (Sem necessidade atrelada)";

            // 2. SE UMA NECESSIDADE FOI SELECIONADA, DISPARA O FECHAMENTO DELA
            if (idNecessidade) {
                const necAtual = necessidadesLista.find(n => n.id_necessidade === Number(idNecessidade));
                if (necAtual) {
                    const payloadNecessidade = {
                        descricao: necAtual.descricao,
                        observacoes: necAtual.observacoes,
                        ativa: false,
                        id_animal: necAtual.id_animal
                    };

                    const resNec = await fetch(`/api/necessidades/${idNecessidade}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payloadNecessidade),
                    });

                    if (resNec.ok) {
                        necessidadeFechada = `Resolvida: ${necAtual.descricao}`;
                    } else {
                        console.warn("Estoque abatido, mas falha ao fechar necessidade.");
                        necessidadeFechada = "Aviso: Falha ao fechar status da necessidade";
                    }
                }
            }

            exibirMensagem("Sucesso! Uso registrado e estoque atualizado.");

            const novoRegistroSessao: RegistroUsoSessao = {
                id_registro_uso: dataRegistro.id_registro_uso || dataRegistro._id_registro_uso || Math.random(),
                id_cuidador: payloadRegistro.id_cuidador,
                id_animal: payloadRegistro.id_animal,
                id_suprimento: payloadRegistro.id_suprimento,
                quantidade_usada: payloadRegistro.quantidade_usada,
                necessidade_resolvida: necessidadeFechada
            };

            setRegistrosSessao(prev => [novoRegistroSessao, ...prev]);
            limparFormulario();

            carregarDadosGlobais(false);

        } catch (error: unknown) {
            console.error("Falha na requisição:", error);
            exibirMensagem("Falha na comunicação com o servidor ao salvar o registro.");
        }
    };

    const limparFormulario = () => {
        setIdAnimal("");
        setIdCuidador("");
        setIdNecessidade("");
        setIdSuprimento("");
        setQuantidade("");
        setObservacoes("");
    };

    const carregarDadosGlobais = async (mostrarAlerta = true) => {
        if (mostrarAlerta) setMensagem("Carregando bases de dados de todo o ecossistema...");
        try {
            // 1. Busca Cuidadores e Suprimentos
            const [resCuidadores, resSuprimentos] = await Promise.all([
                fetch("/api/cuidadores", { cache: "no-store" }),
                fetch("/api/suprimentos", { cache: "no-store" })
            ]);

            let cuidadoresMapeados: CuidadorResumo[] = [];
            if (resCuidadores.ok) {
                const dataCuidadores = await resCuidadores.json();
                cuidadoresMapeados = Array.isArray(dataCuidadores) ? dataCuidadores.map((c: any) => ({
                    id_cuidador: c.id_cuidador ?? c._id_cuidador,
                    nome: c.nome ?? c._nome
                })) : [];
                setCuidadoresLista(cuidadoresMapeados);
            }

            if (resSuprimentos.ok) {
                const dataSuprimentos = await resSuprimentos.json();
                setSuprimentosLista(Array.isArray(dataSuprimentos) ? dataSuprimentos.map((s: any) => ({
                    id_suprimento: s.id_suprimento ?? s._id_suprimento,
                    nome: s.nome ?? s._nome,
                    estoque: s.quantidade_estoque ?? s._quantidade_estoque ?? 0,
                    unidade: s.unidade ?? s._unidade
                })) : []);
            }

            // 2. A JOGADA DE MESTRE: Em vez de buscar todos os animais de uma vez, 
            // buscamos pelos Cuidadores para descobrir o vínculo!
            let todosAnimaisComVincuo: AnimalResumo[] = [];
            let todasNecessidades: Necessidade[] = [];

            await Promise.all(cuidadoresMapeados.map(async (cuidador) => {
                try {
                    const resAnimaisDoCuidador = await fetch(`/api/animais/cuidador/${cuidador.id_cuidador}`, { cache: "no-store" });
                    if (resAnimaisDoCuidador.ok) {
                        const dataAnimais = await resAnimaisDoCuidador.json();

                        if (Array.isArray(dataAnimais)) {
                            for (const animal of dataAnimais) {
                                const idAnimal = animal.id_animal ?? animal._id_animal;

                                // INJEÇÃO DA ASSINATURA: O Frontend vincula o Cuidador à força!
                                todosAnimaisComVincuo.push({
                                    id_animal: idAnimal,
                                    nome: animal.nome ?? animal._nome,
                                    id_cuidador: cuidador.id_cuidador
                                });

                                // Aproveita e já puxa as necessidades deste animal
                                const resNec = await fetch(`/api/animais/${idAnimal}`, { cache: "no-store" });
                                if (resNec.ok) {
                                    const animalCompleto = await resNec.json();
                                    const listaNec = animalCompleto.necessidades || animalCompleto._necessidades;
                                    if (listaNec && Array.isArray(listaNec)) {
                                        const necDesteAnimal = listaNec.map((n: any) => ({
                                            id_necessidade: n.id_necessidade ?? n._id_necessidade,
                                            descricao: n.descricao ?? n._descricao,
                                            observacoes: n.observacoes ?? n._observacoes,
                                            ativa: n.ativa ?? n._ativa ?? true,
                                            id_animal: idAnimal
                                        }));
                                        todasNecessidades.push(...necDesteAnimal);
                                    }
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error(`Erro ao processar dados do cuidador ${cuidador.id_cuidador}`, e);
                }
            }));

            // Ordena a lista de animais alfabeticamente para facilitar a seleção
            todosAnimaisComVincuo.sort((a, b) => a.nome.localeCompare(b.nome));

            setAnimaisLista(todosAnimaisComVincuo);
            setNecessidadesLista(todasNecessidades);

            if (mostrarAlerta) exibirMensagem("Dados carregados com sucesso! Tela pronta para operação.");
        } catch (error: unknown) {
            console.error("Falha ao carregar dados globais:", error);
            if (mostrarAlerta) exibirMensagem("Falha na comunicação com o servidor ao carregar dados.");
        }
    };

    // Helpers para nomes
    const getNomeCuidador = (id: number) => cuidadoresLista.find(c => c.id_cuidador === id)?.nome || `ID ${id}`;
    const getNomeAnimal = (id: number) => animaisLista.find(a => a.id_animal === id)?.nome || `ID ${id}`;
    const getNomeSuprimento = (id: number) => suprimentosLista.find(s => s.id_suprimento === id)?.nome || `ID ${id}`;

    return (
        <div className="container">
            {mensagem && (
                <div className="alerta">
                    <strong>Sistema:</strong> {mensagem}
                </div>
            )}

            <div className="layout-duplo">
                <section className="coluna-form">
                    <h1 className="titulo-principal">Registro de Uso</h1>
                    <h2 className="subtitulo">Consumo e Resolução de Necessidades</h2>

                    <form onSubmit={salvarRegistro} className="formulario">

                        {/* 1. SELEÇÃO DO ANIMAL */}
                        <select value={idAnimal} onChange={(e) => {
                            const animalSelecionado = e.target.value;
                            setIdAnimal(animalSelecionado);
                            setIdNecessidade(""); // Limpa a necessidade ao trocar de animal

                            // A MÁGICA AQUI: Auto-seleciona o Cuidador do Animal!
                            const animalEncontrado = animaisLista.find(a => a.id_animal === Number(animalSelecionado));
                            if (animalEncontrado && animalEncontrado.id_cuidador) {
                                setIdCuidador(animalEncontrado.id_cuidador.toString());
                            } else {
                                setIdCuidador("");
                            }
                        }} required>
                            <option value="" disabled>1. Selecione o Animal (Paciente)</option>
                            {animaisLista.map((a) => (
                                <option key={a.id_animal} value={a.id_animal}>{a.nome}</option>
                            ))}
                        </select>

                        {/* 2. CUIDADOR VINCULADO (Trava Arquitetural: Apenas leitura) */}
                        <select
                            value={idCuidador}
                            disabled
                            required
                            style={{ backgroundColor: "rgba(0,0,0,0.05)", color: "var(--texto-mutado)", cursor: "not-allowed", borderStyle: "dashed" }}
                            title="O Cuidador é definido automaticamente com base no Animal selecionado."
                        >
                            <option value="" disabled>
                                {idAnimal ? "Atenção: Animal sem Cuidador vinculado" : "2. Cuidador (Preenchimento automático)"}
                            </option>
                            {cuidadoresLista.map((c) => (
                                <option key={c.id_cuidador} value={c.id_cuidador}>
                                    Responsável Vinculado: {c.nome}
                                </option>
                            ))}
                        </select>

                        {/* 3. QUAL NECESSIDADE RESOLVE? */}
                        <div style={{ borderLeft: "3px solid var(--roxo-viva)", paddingLeft: "10px", marginBottom: "15px", backgroundColor: "rgba(108, 92, 231, 0.05)", padding: "10px", borderRadius: "0 8px 8px 0" }}>
                            <label style={{ fontSize: "0.85rem", color: "var(--roxo-viva)", fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                                Tarefa / Prontuário do Animal Selecionado:
                            </label>
                            <select value={idNecessidade} onChange={(e) => setIdNecessidade(e.target.value)} disabled={!idAnimal}>
                                <option value="">Nenhuma / Uso Avulso</option>
                                {necessidadesDoAnimal.map((n) => (
                                    <option key={n.id_necessidade} value={n.id_necessidade}>
                                        Resolver: {n.descricao}
                                    </option>
                                ))}
                            </select>
                            {idAnimal && necessidadesDoAnimal.length === 0 && (
                                <span style={{ fontSize: "0.8rem", color: "var(--texto-mutado)" }}>Este animal não possui necessidades ativas/pendentes.</span>
                            )}
                        </div>

                        {/* 4. QUAL SUPRIMENTO E QUANTIDADE? */}
                        <select value={idSuprimento} onChange={(e) => setIdSuprimento(e.target.value)} required>
                            <option value="" disabled>3. Qual suprimento foi utilizado?</option>
                            {suprimentosLista.map((s) => (
                                <option key={s.id_suprimento} value={s.id_suprimento} disabled={s.estoque <= 0}>
                                    {s.nome} (Estoque: {s.estoque} {s.unidade}) {s.estoque <= 0 ? "- ESGOTADO" : ""}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            placeholder="4. Quantidade Utilizada"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            required
                            min="0.01"
                            step="any"
                        />

                        <input
                            type="text"
                            placeholder="Observações do consumo (Opcional)"
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                        />

                        <div className="botoes-form">
                            <button type="submit" className="botao" disabled={animaisLista.length === 0}>
                                Consumir Suprimento
                            </button>
                        </div>
                    </form>
                </section>

                <section className="coluna-lista">
                    <h1 className="titulo-principal">Histórico de Uso</h1>
                    <h2 className="subtitulo" style={{ marginBottom: "15px" }}>Registros desta Sessão</h2>

                    <div className="tabela-wrapper">
                        <table className="tabela">
                            <thead>
                                <tr className="tabela-cabecalho">
                                    <th>Cuidador</th>
                                    <th>Animal</th>
                                    <th>Suprimento Usado</th>
                                    <th>Status Prontuário</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrosSessao.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="tabela-vazia">
                                            Nenhum consumo registrado nesta sessão.
                                        </td>
                                    </tr>
                                ) : (
                                    registrosSessao.map((reg, index) => (
                                        <tr key={index}>
                                            <td>{getNomeCuidador(reg.id_cuidador)}</td>
                                            <td><span style={{ fontWeight: "bold" }}>{getNomeAnimal(reg.id_animal)}</span></td>
                                            <td>
                                                <span style={{ color: "var(--coral-viva)", fontWeight: "bold" }}>-{reg.quantidade_usada}</span> {getNomeSuprimento(reg.id_suprimento)}
                                            </td>
                                            <td>
                                                <span style={{ fontSize: "0.85rem", color: reg.necessidade_resolvida?.includes("Resolvida") ? "var(--verde-viva)" : "var(--texto-mutado)" }}>
                                                    {reg.necessidade_resolvida}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <button onClick={() => carregarDadosGlobais(true)} className="botao-atualizar">
                        Carregar Todo o Ecossistema
                    </button>
                </section>
            </div>
        </div>
    );
}