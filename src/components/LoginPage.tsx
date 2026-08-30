import React, { useState } from 'react';
import { 
  Building2, 
  Stethoscope, 
  Users, 
  Lock, 
  Mail, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  KeyRound,
  FileCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { AuthUser, UserProfile } from '../types';
import { DGEPLogo } from './DGEPLogo';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nome, setNome] = useState('');
  const [perfil, setPerfil] = useState<UserProfile>('rh');
  const [documento, setDocumento] = useState('');
  const [uf, setUf] = useState('PR');
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Check if domain ends with @cmc.pr.gov.br
  const isDomainValid = (emailStr: string) => {
    const trimmed = emailStr.trim().toLowerCase();
    return trimmed.endsWith('@cmc.pr.gov.br') && trimmed.length > '@cmc.pr.gov.br'.length;
  };

  const domainStatus = email.trim() === '' 
    ? 'empty' 
    : isDomainValid(email) 
      ? 'valid' 
      : 'invalid';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMsg('Informe o seu e-mail institucional.');
      return;
    }

    if (!cleanEmail.endsWith('@cmc.pr.gov.br')) {
      setErrorMsg('Acesso restrito! O e-mail deve obrigatoriamente pertencer ao domínio institucional @cmc.pr.gov.br');
      return;
    }

    if (!password) {
      setErrorMsg('Informe sua senha de rede institucional ou código de acesso.');
      return;
    }

    // Determine default name / doc if not filled
    let finalNome = nome.trim();
    if (!finalNome) {
      // Derive name from email (e.g. cristina.jesus -> Cristina Jesus)
      const userPart = cleanEmail.split('@')[0];
      finalNome = userPart
        .split('.')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
    }

    let finalDoc = documento.trim();
    if (!finalDoc) {
      if (perfil === 'medico') finalDoc = 'CRM/PR 00000';
      else if (perfil === 'social') finalDoc = 'CRESS/PR 0000';
      else finalDoc = 'MAT-DGEP';
    }

    let cargoTitle = 'Analista de Gestão de Pessoas';
    if (perfil === 'medico') cargoTitle = 'Médico Perito Oficial';
    if (perfil === 'social') cargoTitle = 'Assistente Social Pericial';

    const authUser: AuthUser = {
      email: cleanEmail,
      nome: finalNome,
      perfil: perfil,
      documento: finalDoc,
      uf: uf,
      cargo: cargoTitle,
      dataLogin: new Date().toISOString()
    };

    onLogin(authUser);
  };

  // Quick-fill demo institutional accounts
  const handleQuickFill = (demoEmail: string, demoNome: string, demoPerfil: UserProfile, demoDoc: string) => {
    setEmail(demoEmail);
    setNome(demoNome);
    setPerfil(demoPerfil);
    setDocumento(demoDoc);
    setPassword('cmc@2026');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#042749] to-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      
      {/* Decorative subtle ambient lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* LOGO E CABEÇALHO */}
        <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl mb-4">
          <DGEPLogo size={64} className="shadow-lg" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
          CÂMARA MUNICIPAL DE CURITIBA
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-sky-200 mt-1 uppercase tracking-wider">
          Diretoria de Gestão de Pessoas (DGEP)
        </p>
        <p className="text-xs text-slate-300 mt-1">
          Sistema de Avaliação Biopsicossocial &bull; IF-BRA
        </p>
      </div>

      {/* LOGIN CARD */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-white/95 backdrop-blur-md text-slate-900 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/40">
          
          <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Acesso Restrito aos Profissionais
              </h3>
              <p className="text-xs text-slate-500">
                Autenticação com e-mail institucional <strong>@cmc.pr.gov.br</strong>
              </p>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* SELEÇÃO DE PERFIL FUNCIONAL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Selecione seu Perfil de Acesso:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPerfil('rh');
                    if (documento.startsWith('CRM') || documento.startsWith('CRESS')) setDocumento('');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition cursor-pointer ${
                    perfil === 'rh'
                      ? 'bg-purple-50 border-purple-500 text-purple-950 font-bold shadow-xs ring-2 ring-purple-400/40'
                      : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className={`w-5 h-5 mb-1.5 ${perfil === 'rh' ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span className="text-[11px] leading-tight">Gestão de Pessoas</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">DGEP / RH</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPerfil('medico');
                    if (!documento) setDocumento('CRM/PR ');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition cursor-pointer ${
                    perfil === 'medico'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs ring-2 ring-emerald-400/40'
                      : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Stethoscope className={`w-5 h-5 mb-1.5 ${perfil === 'medico' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="text-[11px] leading-tight">Médico Perito</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Junta Médica</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPerfil('social');
                    if (!documento) setDocumento('CRESS/PR ');
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition cursor-pointer ${
                    perfil === 'social'
                      ? 'bg-sky-50 border-sky-500 text-sky-950 font-bold shadow-xs ring-2 ring-sky-400/40'
                      : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Users className={`w-5 h-5 mb-1.5 ${perfil === 'social' ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span className="text-[11px] leading-tight">Assistente Social</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Serviço Social</span>
                </button>
              </div>
            </div>

            {/* CAMPO DE E-MAIL INSTITUCIONAL */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  E-mail Institucional <span className="text-red-500">*</span>
                </label>
                {domainStatus === 'valid' && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center space-x-1 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Domínio @cmc.pr.gov.br Verificado</span>
                  </span>
                )}
                {domainStatus === 'invalid' && (
                  <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md flex items-center space-x-1 border border-red-200">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    <span>Requer @cmc.pr.gov.br</span>
                  </span>
                )}
              </div>

              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className={`w-4 h-4 ${domainStatus === 'valid' ? 'text-emerald-600' : 'text-slate-400'}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nome.sobrenome@cmc.pr.gov.br"
                  className={`block w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border transition ${
                    domainStatus === 'valid' 
                      ? 'border-emerald-500 bg-emerald-50/20 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-medium'
                      : domainStatus === 'invalid'
                        ? 'border-red-400 bg-red-50/20 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-red-900'
                        : 'border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900'
                  }`}
                  required
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Utilize seu endereço institucional oficial da Câmara Municipal de Curitiba.
              </p>
            </div>

            {/* DOCUMENTO PROFISSIONAL (CRM / CRESS / MATRÍCULA) & NOME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo do Profissional
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Ex: Dra. Cristina Jesus"
                  className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {perfil === 'medico' ? 'Registro CRM/UF' : perfil === 'social' ? 'Registro CRESS/UF' : 'Matrícula Funcional'}
                </label>
                <input
                  type="text"
                  value={documento}
                  onChange={e => setDocumento(e.target.value)}
                  placeholder={perfil === 'medico' ? 'CRM/PR 00.000' : perfil === 'social' ? 'CRESS/PR 0.000' : 'Matrícula DGEP'}
                  className="w-full text-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* SENHA OU CÓDIGO DE REDE */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Senha de Rede CMC <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <KeyRound className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* MENSAGEM DE ERRO */}
            {errorMsg && (
              <div className="text-xs text-red-700 bg-red-50 p-3 rounded-xl border border-red-200 flex items-start space-x-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-tight font-medium">{errorMsg}</span>
              </div>
            )}

            {/* LEMBRAR USUÁRIO */}
            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 h-3.5 w-3.5"
                />
                <span>Lembrar credencial nesta estação de trabalho</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                Conexão Segura CMC
              </span>
            </div>

            {/* BOTÃO ENTRAR */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full text-xs sm:text-sm font-bold py-3 px-4 rounded-xl text-white bg-[#042749] hover:bg-[#063a6e] active:scale-[0.99] transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-sky-300" />
                <span>Entrar no Sistema Biopsicossocial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* ACESSO RÁPIDO PARA DEMO / TESTES DE HOMOLOGAÇÃO */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Acessos Rápidos Homologados (@cmc.pr.gov.br):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill(
                  'cristina.jesus@cmc.pr.gov.br', 
                  'Dra. Cristina Jesus', 
                  'rh', 
                  'MAT-DGEP-01'
                )}
                className="p-2 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-left transition cursor-pointer text-[11px]"
              >
                <div className="font-bold text-purple-900 truncate">Cristina Jesus</div>
                <div className="text-purple-700 text-[10px]">Gestão DGEP</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill(
                  'dr.silva.perito@cmc.pr.gov.br', 
                  'Dr. Roberto Silva', 
                  'medico', 
                  'CRM/PR 28.450'
                )}
                className="p-2 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-left transition cursor-pointer text-[11px]"
              >
                <div className="font-bold text-emerald-900 truncate">Dr. Roberto Silva</div>
                <div className="text-emerald-700 text-[10px]">Médico Perito</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill(
                  'as.marta.social@cmc.pr.gov.br', 
                  'Marta Oliveira', 
                  'social', 
                  'CRESS/PR 7.820'
                )}
                className="p-2 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-left transition cursor-pointer text-[11px]"
              >
                <div className="font-bold text-sky-900 truncate">Marta Oliveira</div>
                <div className="text-sky-700 text-[10px]">Serviço Social</div>
              </button>
            </div>
          </div>

          {/* AVISO DE CONFORMIDADE LEGAL & PRIVACIDADE */}
          <div className="mt-5 text-[10px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-start space-x-2">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              O acesso aos dados funcionais e laudos biopsicossociais é protegido pela Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e pelas normas periciais do CFM e CFESS. Todo acesso e assinatura eletrônica são auditados.
            </p>
          </div>

        </div>

        {/* FOOTER CRÉDITOS */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          &copy; {new Date().getFullYear()} Câmara Municipal de Curitiba &bull; Diretoria de Gestão de Pessoas
        </p>
      </div>

    </div>
  );
};
