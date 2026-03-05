import React from 'react';
import { ExternalLink, Database, BookOpen, Download, ShieldCheck } from 'lucide-react';

export const VirtualLibrary: React.FC = () => {
  const DRIVE_URL = "https://drive.google.com/drive/folders/1_etyyFdk_H3i3wSXzKtklhOa5yvRs0qn?usp=drive_link";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 md:p-12">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
              Digital Resource
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
              Biblioteca <span className="text-primary italic underline decoration-primary/30">Virtual</span> Vocare
            </h2>
            <p className="text-lg text-muted-foreground font-medium max-w-xl">
              Acesse nosso acervo digital completo diretamente no Google Drive. Centenas de títulos em PDF e E-book para download imediato e estudo individual.
            </p>
            <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
              <a 
                href={DRIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-[0.98] transition-all gap-2"
              >
                Acessar Drive Completo
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="w-full max-w-sm aspect-square bg-gradient-to-br from-primary/20 to-transparent rounded-full flex items-center justify-center relative group">
            <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="w-48 h-64 bg-card rounded-2xl shadow-2xl border border-border flex flex-col p-4 transform -rotate-12 group-hover:rotate-0 transition-all duration-500 scale-110 z-10">
                <div className="w-full h-40 bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <Database className="w-12 h-12 text-primary/30" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-8 rounded-[2rem] border border-border hover:border-primary/30 transition-all group">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold mb-3">Vasto Acervo</h3>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Títulos organizados por categorias: Patrística, Teologia, Filosofia e documentos da Igreja.
            </p>
        </div>

        <div className="bg-card p-8 rounded-[2rem] border border-border hover:border-primary/30 transition-all group">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Download className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold mb-3">Acesso Offline</h3>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Baixe os arquivos para ler em seu Kindle, tablet ou computador quando não estiver conectado.
            </p>
        </div>

        <div className="bg-card p-8 rounded-[2rem] border border-border hover:border-primary/30 transition-all group">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold mb-3">Links Seguros</h3>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Repositório verificado e mantido pela administração do seminário para garantir integridade.
            </p>
        </div>
      </div>
    </div>
  );
};
