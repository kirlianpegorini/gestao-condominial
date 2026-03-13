const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyLMMm6JXgkzKXoyBG6O2IXuQ09jJgiNC6rm6RfNbVYrzpmRDwIx30QHRygDmyQYz9U/exec';

export interface Condominio {
  ID_Condominio: string;
  Nome_Condominio: string;
  Status: string;
}

export interface RoteiroItem {
  Roteiro_ID: string;
  ID_Condominio: string;
  Local: string;
  Andar: string;
  Ordem: number;
  Item: string;
}

export interface Vistoria {
  ID_Vistoria: string;
  ID_Condominio: string;
  Data: string;
  Fiscal: string;
  Status: string;
  DataHora_Inicio: string;
  DataHora_Fim: string;
  Comentarios_Gerais: string;
  Total_Problemas: number;
}

export interface VistoriaExecucao {
  ID_Execucao: string;
  ID_Vistoria: string;
  Roteiro_ID: string;
  ID_Condominio: string;
  Ordem: number;
  Local: string;
  Andar: string;
  Item: string;
  Resposta: string;
  Descricao_Problema: string;
  Observacao: string;
  Foto_URL: string;
  Respondido: string;
  DataHora_Resposta: string;
}

function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function callApi(action: string, payload: Record<string, any> = {}): Promise<any> {
  const body = { action, ...payload };
  
  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}

// ---- Condominios ----

export async function getCondominios(): Promise<Condominio[]> {
  const result = await callApi('getCondominios');
  return result.data || result;
}

// ---- Roteiro ----

export async function getRoteiro(idCondominio: string): Promise<RoteiroItem[]> {
  const result = await callApi('getRoteiro', { ID_Condominio: idCondominio });
  const items: RoteiroItem[] = result.data || result;
  return items.sort((a, b) => Number(a.Ordem) - Number(b.Ordem));
}

// ---- Vistorias ----

export async function getVistorias(): Promise<Vistoria[]> {
  const result = await callApi('getVistorias');
  return result.data || result;
}

export async function criarVistoria(params: {
  ID_Condominio: string;
  Data: string;
  Fiscal: string;
}): Promise<string> {
  const idVistoria = generateId();
  await callApi('criarVistoria', {
    ID_Vistoria: idVistoria,
    ID_Condominio: params.ID_Condominio,
    Data: params.Data,
    Fiscal: params.Fiscal,
    Status: 'Em andamento',
    DataHora_Inicio: new Date().toISOString(),
    DataHora_Fim: '',
    Comentarios_Gerais: '',
    Total_Problemas: 0,
  });
  return idVistoria;
}

export async function finalizarVistoria(params: {
  ID_Vistoria: string;
  Total_Problemas: number;
  Comentarios_Gerais?: string;
}): Promise<void> {
  await callApi('finalizarVistoria', {
    ID_Vistoria: params.ID_Vistoria,
    Status: 'Finalizada',
    DataHora_Fim: new Date().toISOString(),
    Total_Problemas: params.Total_Problemas,
    Comentarios_Gerais: params.Comentarios_Gerais || '',
  });
}

// ---- Execucao ----

export async function salvarExecucaoItem(params: {
  ID_Vistoria: string;
  Roteiro_ID: string;
  ID_Condominio: string;
  Ordem: number;
  Local: string;
  Andar: string;
  Item: string;
  Resposta: string;
  Descricao_Problema: string;
  Observacao: string;
  Foto_URL: string;
}): Promise<void> {
  const idExecucao = generateId();
  await callApi('salvarExecucaoItem', {
    ID_Execucao: idExecucao,
    ID_Vistoria: params.ID_Vistoria,
    Roteiro_ID: params.Roteiro_ID,
    ID_Condominio: params.ID_Condominio,
    Ordem: params.Ordem,
    Local: params.Local,
    Andar: params.Andar,
    Item: params.Item,
    Resposta: params.Resposta,
    Descricao_Problema: params.Descricao_Problema,
    Observacao: params.Observacao,
    Foto_URL: params.Foto_URL,
    Respondido: 'TRUE',
    DataHora_Resposta: new Date().toISOString(),
  });
}

// ---- Execucao read ----

export async function getExecucaoByVistoria(idVistoria: string): Promise<VistoriaExecucao[]> {
  const result = await callApi('getExecucaoByVistoria', { ID_Vistoria: idVistoria });
  return result.data || result;
}

export async function getAllExecucao(): Promise<VistoriaExecucao[]> {
  const result = await callApi('getAllExecucao');
  return result.data || result;
}

// ---- Upload foto (base64 para Apps Script salvar no Drive) ----

export async function uploadFoto(base64: string, fileName: string): Promise<string> {
  const result = await callApi('uploadFoto', { base64, fileName });
  return result.url || result.data?.url || '';
}

// Helper to convert File to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/...;base64, prefix
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
