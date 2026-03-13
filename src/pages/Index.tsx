import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, LayoutDashboard, ArrowRight, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6 tracking-widest uppercase">
          <Building2 size={14} />
          App de Vistorias
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-tight font-sans">
          Gestão <span className="text-primary">Condominial</span>
        </h1>
        <div className="w-16 h-0.5 bg-primary/40 mx-auto mt-6 rounded-full" />
        <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-sm mx-auto font-medium">
          Fiscalização e Apontamentos
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card 
            className="group cursor-pointer border-2 border-transparent hover:border-primary/40 hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm"
            onClick={() => navigate('/nova-vistoria')}
          >
            <CardHeader className="flex flex-row items-center gap-4 p-6">
              <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shrink-0">
                <ClipboardCheck size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl font-bold">Nova Vistoria</CardTitle>
                <CardDescription className="text-base mt-1 text-muted-foreground">
                  Iniciar um roteiro guiado completo
                </CardDescription>
              </div>
              <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Card 
            className="group cursor-pointer border-2 border-transparent hover:border-secondary/30 hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm"
            onClick={() => navigate('/admin')}
          >
            <CardHeader className="flex flex-row items-center gap-4 p-6">
              <div className="p-4 bg-secondary/10 rounded-2xl text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors duration-300 shrink-0">
                <LayoutDashboard size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl font-bold">Painel da Gestora</CardTitle>
                <CardDescription className="text-base mt-1 text-muted-foreground">
                  Relatórios, métricas e acompanhamento
                </CardDescription>
              </div>
              <ArrowRight size={20} className="text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
            </CardHeader>
          </Card>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-xs text-muted-foreground mt-12 relative z-10 tracking-wide"
      >
        v1.0 • Powered by Verttek
      </motion.p>
    </div>
  );
}
