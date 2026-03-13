import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getCondominios, criarVistoria, type Condominio } from "@/lib/sheetsApi";

export default function NewInspection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [condominios, setCondominios] = useState<Condominio[]>([]);
  const [loadingCondos, setLoadingCondos] = useState(true);
  const [formData, setFormData] = useState({
    idCondominio: "",
    nomeCondominio: "",
    inspectorName: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    getCondominios()
      .then(data => {
        const ativos = data.filter(c => c.Status === 'Ativo' || c.Status === 'ativo' || !c.Status);
        setCondominios(ativos);
      })
      .catch(err => {
        toast({ title: "Erro ao carregar condomínios", description: err.message, variant: "destructive" });
      })
      .finally(() => setLoadingCondos(false));
  }, []);

  const handleCondoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const condo = condominios.find(c => c.ID_Condominio === id);
    setFormData({
      ...formData,
      idCondominio: id,
      nomeCondominio: condo?.Nome_Condominio || ''
    });
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const idVistoria = await criarVistoria({
        ID_Condominio: formData.idCondominio,
        Data: formData.date,
        Fiscal: formData.inspectorName,
      });

      toast({
        title: "Vistoria iniciada!",
        description: "Siga o roteiro obrigatório.",
      });
      
      navigate(`/vistoria/${idVistoria}?condo=${encodeURIComponent(formData.idCondominio)}&nome=${encodeURIComponent(formData.nomeCondominio)}`);
    } catch (error: any) {
      toast({
        title: "Erro ao iniciar vistoria",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center relative overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Background Image - Desfocada e Fixa */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80 pointer-events-none"
        style={{ backgroundImage: "url('/background-login.jpg')" }}
      />
      <div className="fixed inset-0 z-0 bg-slate-950/70 backdrop-blur-md pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <Card className="w-full shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
          <CardHeader className="space-y-1 border-b bg-slate-50/50 rounded-t-xl pb-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="-ml-2 hover:bg-slate-200/50">
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </Button>
              <CardTitle className="text-2xl text-slate-800">Iniciar Vistoria</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleStart} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-base font-semibold text-slate-700">Condomínio</Label>
                {loadingCondos ? (
                  <div className="flex items-center gap-2 text-muted-foreground h-12 px-3 bg-slate-50 rounded-md border border-slate-200">
                    <Loader2 className="w-4 h-4 animate-spin" /> Carregando...
                  </div>
                ) : (
                  <select 
                    className="flex h-12 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base md:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-slate-800 shadow-sm"
                    value={formData.idCondominio}
                    onChange={handleCondoChange}
                    required
                  >
                    <option value="">Selecione o condomínio...</option>
                    {condominios.map(c => (
                      <option key={c.ID_Condominio} value={c.ID_Condominio}>
                        {c.Nome_Condominio}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-base font-semibold text-slate-700">Nome do Fiscal</Label>
                <Input 
                  required 
                  className="h-12 text-base border-slate-300 text-slate-800 shadow-sm focus-visible:ring-blue-500"
                  placeholder="Ex: João Silva"
                  value={formData.inspectorName}
                  onChange={(e) => setFormData({...formData, inspectorName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold text-slate-700">Data da Vistoria</Label>
                <Input 
                  type="date" 
                  required
                  className="h-12 text-base border-slate-300 text-slate-800 shadow-sm focus-visible:ring-blue-500"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div className="pt-6">
                <Button type="submit" className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-transform active:scale-[0.98]" disabled={loading || loadingCondos}>
                  {loading ? 'Preparando...' : 'Começar Vistoria'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
