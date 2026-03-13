import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Camera, Check, X, ArrowRight, Loader2 } from "lucide-react";
import { getRoteiro, salvarExecucaoItem, finalizarVistoria, uploadFoto, fileToBase64, type RoteiroItem } from "@/lib/sheetsApi";

type Answer = {
  status: 'ok' | 'problem';
  desc: string;
  photo: File | null;
};

interface LocationBlock {
  location: string;
  andar: string;
  items: RoteiroItem[];
}

export default function ActiveInspection() {
  const { id: idVistoria } = useParams();
  const [searchParams] = useSearchParams();
  const idCondominio = searchParams.get('condo') || '';
  const nomeCondominio = searchParams.get('nome') || '';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [blocks, setBlocks] = useState<LocationBlock[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [blockObservation, setBlockObservation] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRoteiro, setLoadingRoteiro] = useState(true);
  const [problemCount, setProblemCount] = useState(0);

  useEffect(() => {
    if (!idCondominio) return;
    getRoteiro(idCondominio)
      .then(items => {
        const blockMap = new Map<string, LocationBlock>();
        for (const item of items) {
          const key = `${item.Local}||${item.Andar || ''}`;
          if (!blockMap.has(key)) {
            blockMap.set(key, { location: item.Local, andar: item.Andar || '', items: [] });
          }
          blockMap.get(key)!.items.push(item);
        }
        setBlocks(Array.from(blockMap.values()));
      })
      .catch(err => {
        toast({ title: "Erro ao carregar roteiro", description: err.message, variant: "destructive" });
      })
      .finally(() => setLoadingRoteiro(false));
  }, [idCondominio]);

  const currentBlock = blocks[currentIndex];

  const updateAnswer = (itemKey: string, field: keyof Answer, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [itemKey]: {
        ...(prev[itemKey] || { status: 'ok', desc: '', photo: null }),
        [field]: value
      }
    }));
  };

  const setStatus = (itemKey: string, status: 'ok' | 'problem') => {
    setAnswers(prev => ({
      ...prev,
      [itemKey]: {
        ...(prev[itemKey] || { desc: '', photo: null }),
        status
      }
    }));
  };

  const handleTakePhoto = (itemKey: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) updateAnswer(itemKey, 'photo', file);
    };
    input.click();
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      let blockProblems = 0;

      for (const roteiroItem of currentBlock.items) {
        const itemKey = roteiroItem.Roteiro_ID;
        const ans = answers[itemKey];
        if (!ans) continue;

        let fotoUrl = '';
        if (ans.photo) {
          try {
            const base64 = await fileToBase64(ans.photo);
            fotoUrl = await uploadFoto(base64, `${idVistoria}_${roteiroItem.Roteiro_ID}_${Date.now()}.jpg`);
          } catch {
            // If upload fails, continue without photo
          }
        }

        const resposta = ans.status === 'ok' ? 'OK' : 'Problema';
        if (resposta === 'Problema') blockProblems++;

        await salvarExecucaoItem({
          ID_Vistoria: idVistoria!,
          Roteiro_ID: roteiroItem.Roteiro_ID,
          ID_Condominio: idCondominio,
          Ordem: Number(roteiroItem.Ordem),
          Local: roteiroItem.Local,
          Andar: roteiroItem.Andar || '',
          Item: roteiroItem.Item,
          Resposta: resposta,
          Descricao_Problema: ans.status === 'problem' ? ans.desc : '',
          Observacao: blockObservation || '',
          Foto_URL: fotoUrl,
        });
      }

      const newTotal = problemCount + blockProblems;
      setProblemCount(newTotal);

      if (currentIndex < blocks.length - 1) {
        setCurrentIndex(curr => curr + 1);
        setAnswers({});
        setBlockObservation('');
        window.scrollTo(0, 0);
      } else {
        await finalizarVistoria({
          ID_Vistoria: idVistoria!,
          Total_Problemas: newTotal,
        });
        toast({ title: "Vistoria Concluída!", description: "Todos os locais foram verificados." });
        navigate('/admin');
      }
    } catch (error: any) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loadingRoteiro) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" /> Carregando roteiro...
      </div>
    );
  }

  if (!currentBlock) {
    return <div className="p-8 text-center font-medium text-foreground">Nenhum item encontrado no roteiro.</div>;
  }

  const progress = Math.round((currentIndex / blocks.length) * 100);
  const allAnswered = currentBlock.items.every(item => answers[item.Roteiro_ID]?.status);
  const problemsDescribed = currentBlock.items.every(item => {
    const ans = answers[item.Roteiro_ID];
    if (ans?.status === 'problem' && !ans.desc.trim()) return false;
    return true;
  });
  const canProceed = allAnswered && problemsDescribed;

  const blockTitle = currentBlock.andar 
    ? `${currentBlock.location} - ${currentBlock.andar}` 
    : currentBlock.location;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-28">
      {/* Header with progress */}
      <div className="bg-card px-4 py-3 shadow-lg sticky top-0 z-20 border-b border-border">
        <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
          <span className="truncate max-w-[60%]">{nomeCondominio}</span>
          <span className="text-primary font-bold">{currentIndex + 1}/{blocks.length} • {progress}%</span>
        </div>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <div className="bg-primary h-full transition-all duration-500 ease-out rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="flex-1 p-4 max-w-2xl w-full mx-auto space-y-4">
        <div className="mb-6">
          <h2 className="text-3xl font-black text-foreground tracking-tight">{blockTitle}</h2>
          <p className="text-muted-foreground text-sm mt-1">Verifique todos os itens abaixo</p>
        </div>

        <div className="space-y-3">
          {currentBlock.items.map((roteiroItem) => {
            const itemKey = roteiroItem.Roteiro_ID;
            const ans = answers[itemKey];
            const isOk = ans?.status === 'ok';
            const isProblem = ans?.status === 'problem';

            return (
              <Card key={itemKey} className={`border transition-all duration-200 ${!ans ? 'border-border' : isOk ? 'border-green-500/40' : 'border-red-500/40'}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-base font-semibold text-foreground">{roteiroItem.Item}</span>
                    
                    <div className="flex bg-muted p-1 rounded-lg shrink-0 w-full sm:w-auto">
                      <button 
                        onClick={() => setStatus(itemKey, 'ok')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-md font-bold text-sm transition-all ${isOk ? 'bg-green-500 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <Check size={16} /> OK
                      </button>
                      <button 
                        onClick={() => setStatus(itemKey, 'problem')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-md font-bold text-sm transition-all ${isProblem ? 'bg-red-500 text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <X size={16} /> Problema
                      </button>
                    </div>
                  </div>

                  {isProblem && (
                    <div className="mt-4 pt-4 border-t border-destructive/20 space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-destructive">Qual o problema? *</label>
                        <Textarea 
                          placeholder="Descreva detalhadamente..."
                          className="border-destructive/30 focus-visible:ring-destructive text-base min-h-[80px] bg-background"
                          value={ans.desc || ''}
                          onChange={(e) => updateAnswer(itemKey, 'desc', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground flex items-center gap-2">
                          <Camera size={16} /> Foto (opcional)
                        </label>
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => handleTakePhoto(itemKey)}
                            className="flex-1 h-12 text-base"
                          >
                            <Camera className="mr-2 h-5 w-5" />
                            Tirar Foto
                          </Button>
                          <div className="flex-1">
                            <Input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => updateAnswer(itemKey, 'photo', e.target.files?.[0] || null)}
                              className="file:bg-primary/10 file:text-primary file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:font-medium text-muted-foreground h-12"
                            />
                          </div>
                        </div>
                        {ans.photo && (
                          <p className="text-sm text-green-400 font-medium flex items-center gap-1">
                            <Check size={14} /> {ans.photo.name}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Single observation for the entire block */}
        <Card className="border border-border mt-6">
          <CardContent className="p-4">
            <label className="text-sm font-semibold text-muted-foreground mb-2 block">
              Observação geral deste bloco (opcional)
            </label>
            <Textarea
              placeholder="Alguma observação sobre este local..."
              className="text-base min-h-[70px] bg-background"
              value={blockObservation}
              onChange={(e) => setBlockObservation(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border shadow-2xl z-20">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
          <div className="w-full text-center sm:text-left sm:flex-1 text-sm font-medium text-muted-foreground">
            {!allAnswered 
              ? `Falta responder ${currentBlock.items.length - currentBlock.items.filter(i => answers[i.Roteiro_ID]?.status).length} itens` 
              : (!problemsDescribed ? 'Preencha a descrição dos problemas' : '✓ Pronto para avançar')}
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            {currentIndex > 0 && (
              <Button 
                variant="outline"
                className="flex-1 sm:flex-none h-14 text-lg font-bold rounded-xl"
                disabled={loading}
                onClick={() => { setCurrentIndex(curr => curr - 1); setAnswers({}); setBlockObservation(''); window.scrollTo(0, 0); }}
              >
                Voltar
              </Button>
            )}
            <Button 
              className="flex-1 h-14 text-lg font-bold shadow-lg rounded-xl"
              disabled={!canProceed || loading}
              onClick={handleNext}
            >
              {loading ? 'Salvando...' : currentIndex === blocks.length - 1 ? 'Concluir Vistoria' : 'Próximo Local'}
              {!loading && currentIndex < blocks.length - 1 && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
