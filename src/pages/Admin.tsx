import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ArrowLeft, ClipboardCheck, Lock, Loader2, Camera, AlertTriangle, CheckCircle, BarChart3, ExternalLink, Download, Trash2, X, ZoomIn, ExternalLink as OpenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { getVistorias, getAllExecucao, getCondominios, type Vistoria, type VistoriaExecucao, type Condominio } from "@/lib/sheetsApi";

// ─── Photo Lightbox Component ────────────────────────────────────────────────
function PhotoLightbox({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="w-full flex justify-between items-center mb-3 px-1">
          <span className="text-white/70 text-sm font-medium">📷 Foto do Problema</span>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-cyan-300 hover:text-white bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ExternalLink size={14} /> Abrir original
            </a>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white bg-slate-800/80 border border-slate-700 p-1.5 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
          <img
            src={url}
            alt="Foto do problema registrado"
            className="w-full max-h-[75vh] object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '';
              (e.target as HTMLImageElement).alt = 'Não foi possível carregar a imagem';
            }}
          />
        </div>

        {/* Hint */}
        <p className="text-white/40 text-xs mt-3">Clique fora da imagem para fechar</p>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Admin() {
  const [vistorias, setVistorias] = useState<Vistoria[]>([]);
  const [execucao, setExecucao] = useState<VistoriaExecucao[]>([]);
  const [condominios, setCondominios] = useState<Condominio[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vistoriasData, execucaoData, condominiosData] = await Promise.all([
        getVistorias(),
        getAllExecucao(),
        getCondominios()
      ]);
      setVistorias(vistoriasData);
      setExecucao(execucaoData);
      setCondominios(condominiosData.filter(c => c.Status === 'Ativo' || c.Status === 'ativo' || !c.Status));
    } catch (err: any) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  // Metrics helper based on filtered data
  const getMetrics = (vist_filtered: Vistoria[], exec_filtered: VistoriaExecucao[]) => {
    const totalV = vist_filtered.length;
    const emAndamento = vist_filtered.filter(v => v.Status === 'Em andamento').length;
    const finalizadas = vist_filtered.filter(v => v.Status === 'Finalizada').length;
    const problemas = exec_filtered.filter(e => e.Resposta === 'Problema');
    const totalProblemas = problemas.length;
    const comFoto = exec_filtered.filter(e => e.Foto_URL && e.Foto_URL.trim() !== '').length;

    // Problems by local
    const problemasPorLocal: Record<string, number> = {};
    problemas.forEach(p => {
      problemasPorLocal[p.Local] = (problemasPorLocal[p.Local] || 0) + 1;
    });

    return { totalVistorias: totalV, emAndamento, finalizadas, totalProblemas, comFoto, problemasPorLocal, problemas };
  };

  const allMetrics = getMetrics(vistorias, execucao);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" /> Carregando dados...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Background Image - Desfocada e Fixa */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-90 pointer-events-none"
        style={{ backgroundImage: "url('/background-login.jpg')" }}
      />
      <div className="fixed inset-0 z-0 bg-slate-950/40 backdrop-blur-sm pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate('/')} className="rounded-full shrink-0 bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold text-white drop-shadow-md">Painel da Síndica</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="default"
              className="gap-2"
              onClick={() => window.open('https://docs.google.com/spreadsheets/d/1yj9fcAb88DEQaS7Quri_McbW7vYskw0nSuliDHEJHbA/export?format=xlsx', '_blank')}
            >
              <Download className="w-4 h-4" />
              <span>Baixar Backup (Excel)</span>
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.open('https://docs.google.com/spreadsheets/d/1yj9fcAb88DEQaS7Quri_McbW7vYskw0nSuliDHEJHbA/edit', '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Acessar Planilha</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 w-full sm:w-auto overflow-x-auto justify-start flex-nowrap h-auto p-1 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-lg">
            <TabsTrigger value="all" className="px-4 py-2 text-sm md:text-base text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium">Visão Geral (Todos)</TabsTrigger>
            {condominios.map((c) => (
              <TabsTrigger key={c.ID_Condominio} value={c.ID_Condominio} className="px-4 py-2 text-sm md:text-base text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium">
                {c.Nome_Condominio}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-8 mt-0 border-none outline-none">
            <DashboardContent 
              label="Visão Geral" 
              metrics={allMetrics} 
              vistorias={vistorias} 
              execucao={execucao} 
            />
          </TabsContent>

          {condominios.map((c) => {
            const vist = vistorias.filter(v => v.ID_Condominio === c.ID_Condominio);
            const exec = execucao.filter(e => e.ID_Condominio === c.ID_Condominio);
            const m = getMetrics(vist, exec);
            return (
              <TabsContent key={c.ID_Condominio} value={c.ID_Condominio} className="space-y-8 mt-0 border-none outline-none">
                <DashboardContent 
                  label={`Condomínio: ${c.Nome_Condominio}`} 
                  metrics={m} 
                  vistorias={vist} 
                  execucao={exec} 
                />
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Action Card for Cleaning */}
        <Card className="border-red-100 bg-red-50/30">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Resetar Dados (Limpar Planilha)
            </CardTitle>
            <CardDescription className="text-red-600/80">
              Para reiniciar o sistema e apagar todas as vistorias anteriores, faça o download do Backup acima primeiro. Depois, clique no botão "Acessar Planilha", vá no menu superior "Vistorias Admin" {">"} "Limpar Todos os Dados" (Requer permissão no Google Scripts).
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

// Sub-component to render the inner dashboard per tab cleanly
function DashboardContent({ label, metrics, vistorias, execucao }: { label: string, metrics: any, vistorias: Vistoria[], execucao: VistoriaExecucao[] }) {
  const { totalVistorias, emAndamento, finalizadas, totalProblemas, comFoto, problemasPorLocal } = metrics;
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  
  return (
    <div className="space-y-6">
      {/* Photo Lightbox */}
      {selectedPhoto && <PhotoLightbox url={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
      <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-md">{label}</h2>

        {/* Metrics cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/60 backdrop-blur-md border-blue-500/20 text-white shadow-xl">
            <CardContent className="pt-6 text-center">
              <BarChart3 className="w-8 h-8 mx-auto text-blue-400 mb-2 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              <p className="text-4xl font-bold drop-shadow-md">{totalVistorias}</p>
              <p className="text-sm font-semibold text-cyan-200 mt-1 uppercase tracking-wider">Total Vistorias</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/60 backdrop-blur-md border-amber-500/20 text-white shadow-xl">
            <CardContent className="pt-6 text-center">
              <Loader2 className="w-8 h-8 mx-auto text-amber-400 mb-2 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <p className="text-4xl font-bold drop-shadow-md">{emAndamento}</p>
              <p className="text-sm font-semibold text-amber-200 mt-1 uppercase tracking-wider">Em Andamento</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/60 backdrop-blur-md border-green-500/20 text-white shadow-xl">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto text-green-400 mb-2 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <p className="text-4xl font-bold drop-shadow-md">{finalizadas}</p>
              <p className="text-sm font-semibold text-green-200 mt-1 uppercase tracking-wider">Finalizadas</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/60 backdrop-blur-md border-red-500/20 text-white shadow-xl">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto text-red-500 mb-2 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <p className="text-4xl font-bold drop-shadow-md">{totalProblemas}</p>
              <p className="text-sm font-semibold text-red-200 mt-1 uppercase tracking-wider">Total Problemas</p>
            </CardContent>
          </Card>
        </div>

        {/* Extra metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comFoto > 0 && (
            <Card className="bg-slate-900/60 backdrop-blur-md border-blue-500/20 text-white shadow-xl">
              <CardContent className="pt-6 flex items-center gap-4">
                <Camera className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <div>
                  <p className="text-3xl font-bold drop-shadow-md">{comFoto}</p>
                  <p className="text-sm font-semibold text-cyan-200 uppercase tracking-wider">Registros c/ foto</p>
                </div>
              </CardContent>
            </Card>
          )}
          {Object.keys(problemasPorLocal).length > 0 && (
            <Card className="bg-slate-900/60 backdrop-blur-md border-slate-700/50 text-white shadow-xl">
              <CardHeader className="pb-2 border-b border-slate-700/50 mb-2">
                <CardTitle className="text-base font-bold text-slate-100">Problemas por Local</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto w-full pr-2">
                  {Object.entries(problemasPorLocal)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 10)
                    .map(([local, count]) => (
                      <div key={local} className="flex justify-between items-center text-sm bg-slate-800/50 px-3 py-2 rounded-md border border-slate-700/50">
                        <span className="text-cyan-100 font-medium truncate">{local.toString()}</span>
                        <Badge variant="destructive" className="ml-2 shrink-0 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)]">{count as React.ReactNode}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Vistorias list */}
        <div className="grid gap-6">
          <h3 className="text-2xl font-bold text-white mt-4 drop-shadow-md">Últimas Vistorias</h3>
          {vistorias.map(v => {
            const vistProblemas = execucao.filter(
              e => e.ID_Vistoria === v.ID_Vistoria && e.Resposta === 'Problema'
            );
            const isCompleted = v.Status === 'Finalizada';
            
            return (
              <Card key={v.ID_Vistoria} className="border border-slate-700/50 bg-slate-900/70 backdrop-blur-md shadow-xl overflow-hidden">
                <CardHeader className={`border-b border-slate-700/50 ${isCompleted ? 'bg-slate-800/40' : 'bg-amber-900/20'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl mb-1 text-white">{v.ID_Condominio}</CardTitle>
                      <p className="text-sm text-cyan-200 font-medium">
                        {v.Data} • Fiscal: <span className="text-white drop-shadow-sm">{v.Fiscal}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isCompleted ? 'default' : 'secondary'} className={`w-fit text-sm px-3 py-1 ${isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-500 hover:bg-amber-600'}`}>
                        {isCompleted ? 'Finalizada' : 'Em Andamento'}
                      </Badge>
                      <Badge variant="outline" className="text-sm px-3 py-1 border-slate-500 text-slate-200 bg-slate-800/80">
                        {vistProblemas.length} {vistProblemas.length === 1 ? 'problema' : 'problemas'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {vistProblemas.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {vistProblemas.map((prob) => (
                        <div key={prob.ID_Execucao} className="bg-slate-800/80 p-4 rounded-xl border border-red-500/30 flex flex-col gap-2 shadow-inner">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline" className="bg-slate-900 text-cyan-300 border-cyan-800/50">
                              {prob.Local}{prob.Andar ? ` - ${prob.Andar}` : ''}
                            </Badge>
                            <span className="text-xs font-bold text-red-300 bg-red-950/50 px-2 py-1 rounded shadow-sm border border-red-900/50">
                              {prob.Item}
                            </span>
                          </div>
                          <p className="text-slate-200 font-medium mt-1">{prob.Descricao_Problema}</p>
                          {prob.Foto_URL && prob.Foto_URL.trim() !== '' && (
                            <button
                              onClick={() => setSelectedPhoto(prob.Foto_URL)}
                              className="mt-3 group flex items-center gap-2 w-full text-left"
                            >
                              {/* Mini thumbnail */}
                              <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-blue-700/50 bg-slate-700">
                                <img
                                  src={prob.Foto_URL}
                                  alt="Miniatura"
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ZoomIn size={18} className="text-white" />
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-cyan-300 group-hover:text-white transition-colors">Ver Foto</span>
                                <span className="text-xs text-slate-400">Clique para ampliar</span>
                              </div>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-green-900/20 text-green-300 p-4 rounded-xl border border-green-800/50 text-center font-medium">
                      Nenhum problema registrado nesta vistoria.
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          
          {vistorias.length === 0 && (
            <div className="text-center p-16 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-500">
              <ClipboardCheck className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-700 mb-1">Nenhuma vistoria</h3>
              <p>As vistorias realizadas aparecerão aqui.</p>
            </div>
          )}
        </div>
    </div>
  );
}
