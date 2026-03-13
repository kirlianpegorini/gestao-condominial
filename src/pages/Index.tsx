import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ClipboardCheck, LayoutDashboard, ArrowRight, Lock, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Index() {
  const navigate = useNavigate();
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  
  // role can be null, 'zelador', or 'gestora'
  const [role, setRole] = useState<'zelador' | 'gestora' | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === "1234") {
      setRole('zelador');
      setError("");
    } else if (accessCode === "gestora2024") {
      setRole('gestora');
      setError("");
    } else {
      setError("Código de acesso inválido.");
    }
  };

  const handleLogout = () => {
    setRole(null);
    setAccessCode("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 relative overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Background Image / Overlay - Only visibly shown on Login */}
      {!role && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity transition-opacity duration-1000"
          style={{ backgroundImage: "url('/background-login.png')" }}
        />
      )}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-slate-950" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center mt-12 mb-auto">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold mb-8 tracking-widest uppercase shadow-lg shadow-blue-900/20"
        >
          <Lock size={12} />
          Segurança Verttek
        </motion.div>

        {/* Logo and Typography */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center w-full flex flex-col items-center mb-6"
        >
          {/* Logo Verttek (Integrated text) */}
          <img 
            src="/verttek-logo-full.png" 
            alt="Verttek - Gestão e Fiscalização Condominiais" 
            className="w-full max-w-[280px] object-contain drop-shadow-2xl"
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {!role ? (
            /* Login Form */
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full mt-12"
            >
              <Card className="border border-slate-700/50 bg-slate-900/60 backdrop-blur-md shadow-xl p-6">
                <div className="flex flex-col gap-2 mb-6 text-center">
                  <h3 className="text-xl font-bold text-slate-100 flex items-center justify-center gap-2">
                    <KeyRound size={20} className="text-blue-400" />
                    Acesso ao Sistema
                  </h3>
                  <p className="text-sm text-slate-400">Insira seu código para continuar</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Código de Acesso"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className="bg-slate-950/50 border-slate-700 text-center text-lg placeholder:text-slate-500 focus-visible:ring-blue-500 h-12"
                    />
                    {error && <p className="text-red-400 text-sm font-medium text-center">{error}</p>}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12 text-md font-semibold"
                  >
                    Entrar
                  </Button>
                </form>
              </Card>
            </motion.div>
          ) : (
            /* Action Buttons (Logged In) */
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full mt-12 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center px-2 mb-2">
                <span className="text-sm text-slate-400">
                  Logado como: <strong className="text-blue-400 capitalize">{role}</strong>
                </span>
                <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                  Sair
                </button>
              </div>

              {/* Botão de Nova Vistoria (Disponível p/ Todos) */}
              <Card 
                className="group cursor-pointer border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-xl"
                onClick={() => navigate('/nova-vistoria')}
              >
                <div className="flex flex-row items-center gap-4 p-5">
                  <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shrink-0 shadow-inner">
                    <ClipboardCheck size={26} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-100">Nova Vistoria</h3>
                    <p className="text-sm mt-0.5 text-slate-400">
                      Iniciar um roteiro guiado
                    </p>
                  </div>
                  <ArrowRight size={20} className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                </div>
              </Card>

              {/* Botão de Gestão (Disponível apenas p/ Gestora) */}
              {role === 'gestora' && (
                <Card 
                  className="group cursor-pointer border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-xl"
                  onClick={() => navigate('/admin')}
                >
                  <div className="flex flex-row items-center gap-4 p-5">
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300 shrink-0 shadow-inner">
                      <LayoutDashboard size={26} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-100">Painel da Gestora</h3>
                      <p className="text-sm mt-0.5 text-slate-400">
                        Relatórios e Acompanhamento
                      </p>
                    </div>
                    <ArrowRight size={20} className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                  </div>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xs text-slate-500 mt-auto pb-4 relative z-10 tracking-widest uppercase font-medium"
      >
        v1.0 • Powered by Verttek
      </motion.p>
    </div>
  );
}
