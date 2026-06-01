import React, { useState } from 'react';
import { Immeuble, Coproprietaire, Incident, Expense, Announcement } from '../types';
import { 
  Building, Users, AlertTriangle, CreditCard, 
  Megaphone, Plus, Calendar, Shield, ArrowUpRight, 
  CheckCircle, Clock, AlertCircle, Info, Newspaper, MapPin
} from 'lucide-react';

interface DashboardProps {
  building: Immeuble;
  coproprietaires: Coproprietaire[];
  incidents: Incident[];
  expenses: Expense[];
  announcements: Announcement[];
  onAddAnnouncement: (title: string, content: string, category: 'Important' | 'Travaux' | 'Information') => void;
  onNavigateTo: (tab: string) => void;
}

export default function Dashboard({
  building,
  coproprietaires,
  incidents,
  expenses,
  announcements,
  onAddAnnouncement,
  onNavigateTo
}: DashboardProps) {
  const [showAnnounceForm, setShowAnnounceForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'Important' | 'Travaux' | 'Information'>('Information');

  // Filter items specifically for the selected building
  const buildingCopros = coproprietaires.filter(c => c.buildingId === building.id);
  const buildingIncidents = incidents.filter(i => i.buildingId === building.id);
  const buildingExpenses = expenses.filter(e => e.buildingId === building.id);
  const buildingAnnounces = announcements.filter(a => a.buildingId === building.id);

  // Stats calculations
  const unresolvedIncidents = buildingIncidents.filter(i => i.status !== 'Résolu');
  const criticalIncidentsCount = unresolvedIncidents.filter(i => i.priority === 'Urgente' || i.priority === 'Haute').length;
  
  // Total expenses of paid items
  const totalExpensesAmount = buildingExpenses
    .filter(e => e.status === 'Payé')
    .reduce((sum, e) => sum + e.amount, 0);

  // Total co-owner balances
  const totalUnpaidDues = Math.abs(
    buildingCopros
      .filter(c => c.balance < 0)
      .reduce((sum, c) => sum + c.balance, 0)
  );

  const totalCredits = buildingCopros
    .filter(c => c.balance > 0)
    .reduce((sum, c) => sum + c.balance, 0);

  const totalBudgetApproved = buildingExpenses.reduce((sum, e) => sum + e.amount, 0) || 142500;

  // Handle post announcement
  const handleSubmitAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    onAddAnnouncement(newTitle, newContent, newCategory);
    setNewTitle('');
    setNewContent('');
    setNewCategory('Information');
    setShowAnnounceForm(false);
  };

  return (
    <div id="dashboard-section" className="space-y-6">
      
      {/* 1. Header Info Bar with dynamic breadcrumb / summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">Dashboard Copropriété</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-0.5">
            Gestion de confiance : <span className="font-semibold text-indigo-600">{building.name}</span> • Marseille 13009
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigateTo('incidents')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Signaler un Incident
          </button>
          <button 
            onClick={() => onNavigateTo('documents')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            Accéder aux Documents
          </button>
        </div>
      </div>

      {/* 2. Bento Grid Layout Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        
        {/* BENTO BLOCK 1: Santé Financière (Financial Health) - Spans 4 Cols wide, 3 rows tall on lg */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-slate-400 font-mono text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
                  <CreditCard size={12} className="text-indigo-500" /> Gestion & Budgets
                </span>
                <h2 className="text-lg font-bold text-slate-800 font-display mt-1">Santé Financière</h2>
              </div>
              <select className="text-xs bg-slate-100 border border-transparent rounded-lg px-2.5 py-1 font-semibold text-slate-600 hover:border-slate-200 focus:outline-none transition-colors">
                <option>Exercice 2026-2027</option>
                <option>Exercice 2025-2026</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold font-sans">Budget Voté</span>
                <span className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 font-display mt-1">
                  {totalBudgetApproved.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold font-sans">Dépenses Réglées</span>
                <span className="text-xl md:text-2xl font-bold tracking-tight text-emerald-600 font-display mt-1">
                  {totalExpensesAmount.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                </span>
                <span className="text-[10px] text-green-600 font-medium mt-0.5">Sain</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold font-sans">Arriérés Impayés</span>
                <span className={`text-xl md:text-2xl font-bold tracking-tight font-display mt-1 ${totalUnpaidDues > 0 ? 'text-red-500' : 'text-slate-500'}`}>
                  {totalUnpaidDues.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                </span>
              </div>
            </div>
          </div>

          {/* Aesthetic CSS columns chart */}
          <div>
            <span className="text-slate-400 font-mono text-[9px] uppercase block mb-3 font-semibold">Taux de recouvrement mensuel</span>
            <div className="flex items-end gap-3 px-2 h-28">
              <div className="flex-1 bg-indigo-50/70 h-full rounded-t-lg relative group">
                <div className="absolute bottom-0 w-full bg-indigo-200 h-2/3 rounded-t-lg group-hover:bg-indigo-300 transition-all"></div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono font-medium">Jan</span>
              </div>
              <div className="flex-1 bg-indigo-50/70 h-full rounded-t-lg relative group">
                <div className="absolute bottom-0 w-full bg-indigo-200 h-3/4 rounded-t-lg group-hover:bg-indigo-300 transition-all"></div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono font-medium">Fév</span>
              </div>
              <div className="flex-1 bg-indigo-50/70 h-full rounded-t-lg relative group">
                <div className="absolute bottom-0 w-full bg-indigo-300 h-[85%] rounded-t-lg group-hover:bg-indigo-400 transition-all"></div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono font-medium">Mar</span>
              </div>
              <div className="flex-1 bg-indigo-50/70 h-full rounded-t-lg relative group">
                <div className="absolute bottom-0 w-full bg-indigo-500 h-full rounded-t-lg shadow-md shadow-indigo-100"></div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-indigo-600 font-bold font-mono">Avr</span>
              </div>
              <div className="flex-1 bg-indigo-50/70 h-full rounded-t-lg relative group">
                <div className="absolute bottom-0 w-full bg-indigo-200 h-[72%] rounded-t-lg group-hover:bg-indigo-300 transition-all"></div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono font-medium">Mai</span>
              </div>
              <div className="flex-1 bg-indigo-50/70 h-full rounded-t-lg relative group">
                <div className="absolute bottom-0 w-full bg-indigo-200 h-[80%] rounded-t-lg group-hover:bg-indigo-300 transition-all"></div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono font-medium">Juin</span>
              </div>
            </div>
          </div>
        </div>

        {/* BENTO BLOCK 2: Incidents & Maintenance - Spans 2 Cols wide, 4 rows tall */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between min-h-[380px]">
          <div>
            <h2 className="text-lg font-bold text-slate-800 font-display flex items-center justify-between mb-4">
              <span>Incidents & Maintenance</span>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full font-mono">
                {buildingIncidents.length} total
              </span>
            </h2>
            
            <div className="space-y-3.5">
              {buildingIncidents.slice(0, 3).map((inc) => {
                const isUrgent = inc.priority === 'Urgente' || inc.priority === 'Haute';
                return (
                  <div 
                    key={inc.id}
                    onClick={() => onNavigateTo('incidents')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] ${
                      isUrgent 
                        ? 'bg-rose-50/80 border-rose-100 text-rose-950' 
                        : inc.status === 'Résolu' 
                          ? 'bg-emerald-50/60 border-emerald-100 text-emerald-950'
                          : 'bg-slate-50 border-slate-200/80 text-slate-800'
                    }`}
                  >
                    <div className="flex gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white ${
                        isUrgent 
                          ? 'bg-rose-500' 
                          : inc.status === 'Résolu' 
                            ? 'bg-emerald-500' 
                            : 'bg-indigo-500'
                      }`}>
                        {inc.status === 'Résolu' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold leading-tight truncate">{inc.title}</p>
                        <p className="text-[10px] mt-0.5 opacity-80 font-medium">
                          {inc.status} • Signalé par {inc.reportedBy}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {buildingIncidents.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle className="mx-auto text-slate-300 mb-2" size={32} />
                  <p className="text-xs">Aucun incident à signaler.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button 
              onClick={() => onNavigateTo('incidents')}
              className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all cursor-pointer text-center"
            >
              + AJOUTER UNE INTERVENTION
            </button>
          </div>
        </div>

        {/* BENTO BLOCK 3: Prochaine AG - Spans 2 Cols wide */}
        <div className="lg:col-span-2 bg-indigo-600 rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg shadow-indigo-100 relative overflow-hidden min-h-[240px]">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
          
          <div>
            <div className="flex justify-between items-start">
              <span className="p-1 px-2.5 rounded-full bg-white/10 text-[10px] uppercase font-bold tracking-widest border border-white/10">
                Prochaine AG
              </span>
              <Calendar size={18} className="opacity-80" />
            </div>
            <p className="text-[10px] text-white/70 uppercase tracking-tighter mt-4 font-mono font-semibold">Assemblée Générale Ordinaire</p>
            <div className="text-3xl font-black leading-none font-display mt-1">
              25 JUIN <br />
              <span className="text-lg opacity-90 font-bold">2026 À 18H30</span>
            </div>
          </div>

          <div className="mt-6">
            <div 
              onClick={() => onNavigateTo('ag')}
              className="flex items-center gap-2 text-xs bg-white/10 p-3 rounded-xl border border-white/10 hover:bg-white/15 transition-all cursor-pointer"
            >
              <MapPin size={15} className="shrink-0" />
              <span className="font-medium truncate">Mairie 9e (Salon d'Honneur)</span>
            </div>
          </div>
        </div>

        {/* BENTO BLOCK 4: Détails Immeuble - Spans 2 Cols wide */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between min-h-[240px]">
          <div>
            <span className="text-slate-400 font-mono text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1 mb-2">
              <Building size={12} className="text-indigo-500" /> Fiche Technique
            </span>
            <h2 className="text-lg font-bold text-slate-800 font-display mb-4">Détails Immeuble</h2>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-slate-50 p-3 rounded-xl hover:bg-slate-100 transition-colors">
              <p className="text-[9px] text-slate-400 uppercase font-mono font-bold">Lots Total</p>
              <p className="text-lg font-bold text-slate-800 font-display mt-0.5">{building.unitsCount}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl hover:bg-slate-100 transition-colors">
              <p className="text-[9px] text-slate-400 uppercase font-mono font-bold">Occupation</p>
              <p className="text-lg font-bold text-indigo-600 font-display mt-0.5">94%</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl hover:bg-slate-100 transition-colors">
              <p className="text-[9px] text-slate-400 uppercase font-mono font-bold">DPE</p>
              <p className="text-lg font-bold text-amber-500 font-display mt-0.5">C+</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl hover:bg-slate-100 transition-colors">
              <p className="text-[9px] text-slate-400 uppercase font-mono font-bold">Assurance</p>
              <p className="text-lg font-bold text-emerald-500 font-display mt-0.5">À jour</p>
            </div>
          </div>
        </div>

        {/* BENTO BLOCK 5: Actualités Copropriété - Spans 2 Cols wide */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 text-white shadow-xs flex flex-col justify-between min-h-[240px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-indigo-300">Actualités Copropriété</h2>
              </div>
              <button 
                onClick={() => setShowAnnounceForm(!showAnnounceForm)}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold px-2 py-1 rounded"
              >
                + PUBLIER
              </button>
            </div>

            {/* Quick publication inline overlay */}
            {showAnnounceForm ? (
              <form onSubmit={handleSubmitAnnouncement} className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-2 mt-2">
                <input 
                  type="text" 
                  placeholder="Titre..." 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs bg-slate-950 text-white border border-slate-700 rounded-md px-2 py-1"
                  required
                />
                <textarea 
                  rows={2}
                  placeholder="Message..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full text-xs bg-slate-950 text-white border border-slate-700 rounded-md px-2 py-1"
                  required
                />
                <div className="flex justify-between items-center">
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="text-[9px] bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-slate-300"
                  >
                    <option value="Information">💡 Info</option>
                    <option value="Important">🚨 Important</option>
                    <option value="Travaux">🛠️ Travaux</option>
                  </select>
                  <div className="flex gap-1">
                    <button 
                      type="button" 
                      onClick={() => setShowAnnounceForm(false)}
                      className="text-[9px] px-2 py-0.5 hover:bg-slate-700 text-slate-400 rounded"
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit" 
                      className="text-[9px] font-bold px-2.5 py-0.5 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Poster
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-3 mt-2">
                {buildingAnnounces.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucune annonce publiée pour le moment.</p>
                ) : (
                  buildingAnnounces.slice(0, 1).map((a) => (
                    <div key={a.id} className="group cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          a.category === 'Important' 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                            : a.category === 'Travaux' 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {a.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{a.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1.5 leading-snug group-hover:text-indigo-400 transition-colors">
                        {a.title}
                      </h4>
                      <p className="text-xs text-slate-350 italic mt-1 leading-relaxed line-clamp-2">
                        "{a.content}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-4 border-t border-slate-800 pt-4">
            <span className="text-[9px] text-slate-500 uppercase font-mono tracking-widest font-bold">Diffusé par le syndic</span>
            <button 
              onClick={() => {
                // Toggle list / scroll view or search
                alert("Pour consulter toutes les actualités, explorez les annonces historiques via le panneau principal.");
              }}
              className="text-[10px] text-indigo-400 font-bold hover:underline"
            >
              VOIR PLUS
            </button>
          </div>
        </div>

      </div>

      {/* 3. Historical Feed and Active Board Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-slate-850 font-display flex items-center gap-2">
            <Newspaper size={18} className="text-indigo-500" />
            Historique complet des publications
          </h3>
          <span className="text-xs font-mono text-slate-400">Ordinateur de bord de l'immeuble</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {buildingAnnounces.slice(0, 4).map((a) => (
            <div 
              key={a.id} 
              className={`p-4 rounded-xl border transition-all ${
                a.category === 'Important' 
                  ? 'bg-rose-50/50 border-rose-100' 
                  : a.category === 'Travaux' 
                    ? 'bg-amber-50/40 border-amber-100' 
                    : 'bg-indigo-50/20 border-indigo-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  a.category === 'Important' 
                    ? 'bg-rose-100 text-rose-700' 
                    : a.category === 'Travaux' 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-slate-200 text-slate-700'
                }`}>
                  {a.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar size={12} /> {a.date}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-950 leading-snug">{a.title}</h4>
              <p className="text-xs text-slate-600 mt-1 lines-clamp-3 leading-relaxed">{a.content}</p>
            </div>
          ))}

          {buildingAnnounces.length === 0 && (
            <div className="md:col-span-2 text-center py-8 text-slate-400">
              <Megaphone className="mx-auto text-slate-300 mb-2 font-mono" size={32} />
              <p className="text-xs font-medium">Aucune note historique pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
