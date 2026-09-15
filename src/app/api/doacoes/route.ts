import { DoacaoController } from "@/controllers/DoacaoController/DoacaoController";

const doacaoController = new DoacaoController();

export async function POST(req: Request) {
    return doacaoController.cadastrar(req);
}

/*
A entidade de Doação funciona como um registro transacional imutável (você registra a doação 
junto com os itens para abater o estoque, mas não fica editando doações passadas para não 
corromper o histórico do estoque). Por isso, temos apenas o POST na rota estática e o GET (para 
buscar os detalhes completos) na rota dinâmica.
*/