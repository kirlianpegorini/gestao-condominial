import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ArrowLeft, ClipboardCheck, Lock, Loader2, Camera, AlertTriangle, CheckCircle, BarChart3, ExternalLink, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { getVistorias, getAllExecucao, getCondominios, type Vistoria, type VistoriaExecucao, type Condominio } from "@/lib/sheetsApi";

const ADMIN_PASSWORD = "gestora2024";

export default function Admin() {
  const [vistorias, setVistorias] = useState<Vistoria[]>([]);
  const [execucao, setExecucao] = useState<VistoriaExecucao[]>([]);
  const [condominios, setCondominios] = useState<Condominio[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Senha incorreta");
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Área da Gestora</CardTitle>
            <p className="text-slate-500 mt-2">Digite a senha para acessar os relatórios</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-lg text-center"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <Button type="submit" className="w-full h-12 text-lg font-bold">
                Entrar
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" /> Carregando dados...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate('/')} className="rounded-full shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Painel da Síndica</h1>
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
          <TabsList className="mb-4 w-full sm:w-auto overflow-x-auto justify-start flex-nowrap h-auto p-1">
            <TabsTrigger value="all" className="px-4 py-2 text-sm md:text-base">Visão Geral (Todos)</TabsTrigger>
            {condominios.map((c) => (
              <TabsTrigger key={c.ID_Condominio} value={c.ID_Condominio} className="px-4 py-2 text-sm md:text-base">
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
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-700 mb-2">{label}</h2>

        {/* Metrics cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <BarChart3 className="w-8 h-8 mx-auto text-primary mb-2" />
              <p className="text-3xl font-bold">{totalVistorias}</p>
              <p className="text-sm text-muted-foreground">Total Vistorias</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Loader2 className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <p className="text-3xl font-bold">{emAndamento}</p>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <p className="text-3xl font-bold">{finalizadas}</p>
              <p className="text-sm text-muted-foreground">Finalizadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto text-red-500 mb-2" />
              <p className="text-3xl font-bold">{totalProblemas}</p>
              <p className="text-sm text-muted-foreground">Total Problemas</p>
            </CardContent>
          </Card>
        </div>

        {/* Extra metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comFoto > 0 && (
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <Camera className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{comFoto}</p>
                  <p className="text-sm text-muted-foreground">Registros com foto</p>
                </div>
              </CardContent>
            </Card>
          )}
          {Object.keys(problemasPorLocal).length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Problemas por Local</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {Object.entries(problemasPorLocal)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([local, count]) => (
                      <div key={local} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate">{local}</span>
                        <Badge variant="destructive" className="ml-2 shrink-0">{count}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Vistorias list */}
        <div className="grid gap-6">
          <h3 className="text-lg font-semibold text-slate-800 mt-4">Últimas Vistorias</h3>
          {vistorias.map(v => {
            const vistProblemas = execucao.filter(
              e => e.ID_Vistoria === v.ID_Vistoria && e.Resposta === 'Problema'
            );
            const isCompleted = v.Status === 'Finalizada';
            
            return (
              <Card key={v.ID_Vistoria} className="border-0 shadow-md overflow-hidden">
                <CardHeader className={`border-b ${isCompleted ? 'bg-slate-50' : 'bg-amber-50'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl mb-1 text-slate-800">{v.ID_Condominio}</CardTitle>
                      <p className="text-sm text-slate-500 font-medium">
                        {v.Data} • Fiscal: <span className="text-slate-700">{v.Fiscal}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isCompleted ? 'default' : 'secondary'} className="w-fit text-sm px-3 py-1">
                        {isCompleted ? 'Finalizada' : 'Em Andamento'}
                      </Badge>
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        {vistProblemas.length} {vistProblemas.length === 1 ? 'problema' : 'problemas'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {vistProblemas.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {vistProblemas.map((prob) => (
                        <div key={prob.ID_Execucao} className="bg-red-50/50 p-4 rounded-xl border border-red-100 flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline" className="bg-white text-slate-600 border-slate-200">
                              {prob.Local}{prob.Andar ? ` - ${prob.Andar}` : ''}
                            </Badge>
                            <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded shadow-sm">
                              {prob.Item}
                            </span>
                          </div>
                          <p className="text-slate-800 font-medium mt-1">{prob.Descricao_Problema}</p>
                          {prob.Foto_URL && prob.Foto_URL.trim() !== '' && (
                            <div className="mt-2 text-sm text-primary flex items-center gap-1 font-medium bg-primary/5 w-fit px-3 py-1.5 rounded-lg">
                              <Camera size={14} />
                              <a href={prob.Foto_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                Ver Foto Anexada
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 text-center font-medium">
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
