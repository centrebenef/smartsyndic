import React, { useState, useEffect } from 'react';
import { 
  Building, Users, AlertTriangle, CreditCard, 
  Vote, FileText, LayoutDashboard, ChevronDown, 
  Home, LogOut, CheckCircle, Shield, Sparkles, ServerCrash
} from 'lucide-react';

import { 
  Immeuble, Coproprietaire, Incident, Expense, 
  AssembleeGenerale, Announcement, Document 
} from './types';

import { 
  INITIAL_IMMEUBLES, INITIAL_COPROPRIETAIRES, 
  INITIAL_INCIDENTS, INITIAL_EXPENSES, 
  INITIAL_ANNOUNCEMENTS, INITIAL_ASSEMBLEES, 
  INITIAL_DOCUMENTS 
} from './data/mockData';

// Subcomponents import
import Dashboard from './components/Dashboard';
import Coproprietaires from './components/Coproprietaires';
import Incidents from './components/Incidents';
import Finances from './components/Finances';
import AgVoting from './components/AgVoting';
import Documents from './components/Documents';

export default function App() {
  // Current state of active view
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core Data State
  const [immeubles, setImmeubles] = useState<Immeuble[]>(INITIAL_IMMEUBLES);
  const [selectedBuilding, setSelectedBuilding] = useState<Immeuble>(INITIAL_IMMEUBLES[0]);
  const [coproprietaires, setCoproprietaires] = useState<Coproprietaire[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [assemblies, setAssemblies] = useState<AssembleeGenerale[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  // Toggle building chooser dropdown
  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);

  // Load everything from localStorage on startup
  useEffect(() => {
    try {
      const storedCopros = localStorage.getItem('syndic_coproprietaires');
      const storedIncidents = localStorage.getItem('syndic_incidents');
      const storedExpenses = localStorage.getItem('syndic_expenses');
      const storedAnnounces = localStorage.getItem('syndic_announcements');
      const storedAssemblies = localStorage.getItem('syndic_assemblies');
      const storedDocs = localStorage.getItem('syndic_documents');

      setCoproprietaires(storedCopros ? JSON.parse(storedCopros) : INITIAL_COPROPRIETAIRES);
      setIncidents(storedIncidents ? JSON.parse(storedIncidents) : INITIAL_INCIDENTS);
      setExpenses(storedExpenses ? JSON.parse(storedExpenses) : INITIAL_EXPENSES);
      setAnnouncements(storedAnnounces ? JSON.parse(storedAnnounces) : INITIAL_ANNOUNCEMENTS);
      setAssemblies(storedAssemblies ? JSON.parse(storedAssemblies) : INITIAL_ASSEMBLEES);
      setDocuments(storedDocs ? JSON.parse(storedDocs) : INITIAL_DOCUMENTS);
    } catch (e) {
      console.error("Erreur de lecture du localStorage :", e);
      // Fallback
      setCoproprietaires(INITIAL_COPROPRIETAIRES);
      setIncidents(INITIAL_INCIDENTS);
      setExpenses(INITIAL_EXPENSES);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setAssemblies(INITIAL_ASSEMBLEES);
      setDocuments(INITIAL_DOCUMENTS);
    }
  }, []);

  // Save changes to localStorage on states changes
  useEffect(() => {
    if (coproprietaires.length > 0) {
      localStorage.setItem('syndic_coproprietaires', JSON.stringify(coproprietaires));
    }
  }, [coproprietaires]);

  useEffect(() => {
    if (incidents.length > 0) {
      localStorage.setItem('syndic_incidents', JSON.stringify(incidents));
    }
  }, [incidents]);

  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('syndic_expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  useEffect(() => {
    if (announcements.length > 0) {
      localStorage.setItem('syndic_announcements', JSON.stringify(announcements));
    }
  }, [announcements]);

  useEffect(() => {
    if (assemblies.length > 0) {
      localStorage.setItem('syndic_assemblies', JSON.stringify(assemblies));
    }
  }, [assemblies]);

  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem('syndic_documents', JSON.stringify(documents));
    }
  }, [documents]);

  // Handle switching buildings
  const handleSelectBuilding = (building: Immeuble) => {
    setSelectedBuilding(building);
    setShowBuildingDropdown(false);
  };

  // State Mutators
  const handleAddAnnouncement = (title: string, content: string, category: 'Important' | 'Travaux' | 'Information') => {
    const newAnn: Announcement = {
      id: `a-${Date.now()}`,
      title,
      content,
      category,
      date: new Date().toISOString().split('T')[0],
      buildingId: selectedBuilding.id
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const handleAddCoproprietaire = (newCopro: Omit<Coproprietaire, 'id' | 'buildingId'>) => {
    const copro: Coproprietaire = {
      ...newCopro,
      id: `c-${Date.now()}`,
      buildingId: selectedBuilding.id
    };
    setCoproprietaires(prev => [...prev, copro]);
  };

  const handleUpdateBalance = (coproId: string, amount: number, isCharge: boolean) => {
    setCoproprietaires(prev => prev.map(c => {
      if (c.id === coproId) {
        // Charge increases debt (balance becomes more negative)
        // Payment decreases debt (register credit/balance increases positive)
        const diff = isCharge ? -amount : amount;
        return {
          ...c,
          balance: parseFloat((c.balance + diff).toFixed(2))
        };
      }
      return c;
    }));
  };

  const handleAddIncident = (newIncident: Omit<Incident, 'id' | 'buildingId' | 'dateCreated'>) => {
    const inc: Incident = {
      ...newIncident,
      id: `i-${Date.now()}`,
      dateCreated: new Date().toISOString().split('T')[0],
      buildingId: selectedBuilding.id
    };
    setIncidents(prev => [inc, ...prev]);
  };

  const handleUpdateIncidentStatus = (incidentId: string, newStatus: 'Nouveau' | 'En cours' | 'Résolu') => {
    setIncidents(prev => prev.map(i => {
      if (i.id === incidentId) {
        return { ...i, status: newStatus };
      }
      return i;
    }));
  };

  const handleAddExpense = (newExpense: Omit<Expense, 'id' | 'buildingId'>) => {
    const exp: Expense = {
      ...newExpense,
      id: `e-${Date.now()}`,
      buildingId: selectedBuilding.id
    };
    setExpenses(prev => [exp, ...prev]);
  };

  const handleLaunchCallForFunds = (totalAmount: number, title: string) => {
    const activeCopros = coproprietaires.filter(c => c.buildingId === selectedBuilding.id);
    
    // Debit every coproprietaire relative to their tantièmes fraction of totalTantiemes (e.g. 1000)
    setCoproprietaires(prev => prev.map(c => {
      if (c.buildingId === selectedBuilding.id) {
        // Share fraction
        const shareFraction = c.tantiemes / selectedBuilding.totalTantiemes;
        const individualAmount = totalAmount * shareFraction;
        return {
          ...c,
          balance: parseFloat((c.balance - individualAmount).toFixed(2))
        };
      }
      return c;
    }));

    // Record this calling as a special category-friendly pending budget line in expenses
    const newExp: Expense = {
      id: `e-${Date.now()}`,
      title: `[Appel de fonds] ${title}`,
      category: 'Travaux',
      amount: totalAmount,
      date: new Date().toISOString().split('T')[0],
      status: 'En attente',
      buildingId: selectedBuilding.id
    };
    setExpenses(prev => [newExp, ...prev]);
  };

  const handleUpdateResolutionVotes = (
    assemblyId: string,
    resolutionId: string,
    votesFor: number,
    votesAgainst: number,
    abstentions: number,
    status: 'Adopté' | 'Rejeté'
  ) => {
    setAssemblies(prev => prev.map(ag => {
      if (ag.id === assemblyId) {
        return {
          ...ag,
          resolutions: ag.resolutions.map(res => {
            if (res.id === resolutionId) {
              return {
                ...res,
                votesFor,
                votesAgainst,
                abstentions,
                voteStatus: status
              };
            }
            return res;
          })
        };
      }
      return ag;
    }));
  };

  const handleUpdateAssemblyStatus = (assemblyId: string, newStatus: 'Planifiée' | 'En cours' | 'Terminée') => {
    setAssemblies(prev => prev.map(ag => {
      if (ag.id === assemblyId) {
        return { ...ag, status: newStatus };
      }
      return ag;
    }));

    // If marked as Terminée, let's automatically generate a mock assembly minutes (PV) document!
    if (newStatus === 'Terminée') {
      const activeAg = assemblies.find(a => a.id === assemblyId);
      if (activeAg) {
        const title = `PV_Officiel_Signe_${activeAg.title.replace(/\s+/g, '_')}.pdf`;
        const newDoc: Document = {
          id: `d-${Date.now()}`,
          title,
          category: 'PV',
          dateUploaded: new Date().toISOString().split('T')[0],
          fileSize: '1.4 MB',
          buildingId: selectedBuilding.id
        };
        setDocuments(prev => [newDoc, ...prev]);
      }
    }
  };

  const handleAddDocument = (title: string, category: 'Règlement' | 'PV' | 'Facture' | 'Budget', fileSize: string) => {
    const doc: Document = {
      id: `d-${Date.now()}`,
      title,
      category,
      dateUploaded: new Date().toISOString().split('T')[0],
      fileSize,
      buildingId: selectedBuilding.id
    };
    setDocuments(prev => [doc, ...prev]);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  const handleResetData = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données de simulation ?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased font-sans">
      
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-950 shrink-0">
        <div className="p-5 space-y-6">
          
          {/* Syndic Hub Logo & Title */}
          <div className="flex items-center gap-3">
            <span className="p-2 bg-indigo-600 rounded-lg text-white">
              <Building size={20} />
            </span>
            <div>
              <h2 className="text-white font-bold text-sm tracking-tight">SyndicSaaS Pro</h2>
              <p className="text-[10px] text-slate-400 font-mono">PANEL DE GESTION</p>
            </div>
          </div>

          {/* Connected Manager Info Panel */}
          <div className="bg-slate-800/60 border border-slate-750 p-3 rounded-lg flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-505/20 border border-indigo-500/30 flex items-center justify-center text-[11px] font-bold text-white uppercase">
              AG
            </div>
            <div>
              <p className="text-xs font-semibold text-white leading-tight">Admin Gérant</p>
              <span className="text-[10px] text-slate-400">Cabinet Immobilier</span>
            </div>
          </div>

          {/* Main Views Navigation Links */}
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer text-left ${
                activeTab === 'dashboard' 
                  ? 'bg-indigo-600 text-white font-bold' 
                  : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
              }`}
            >
              <LayoutDashboard size={16} /> Table de Bord
            </button>
            <button 
              onClick={() => setActiveTab('coproprietaires')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer text-left ${
                activeTab === 'coproprietaires' 
                  ? 'bg-indigo-600 text-white font-bold' 
                  : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
              }`}
            >
              <Users size={16} /> Copropriétaires
            </button>
            <button 
              onClick={() => setActiveTab('incidents')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer text-left ${
                activeTab === 'incidents' 
                  ? 'bg-indigo-600 text-white font-bold' 
                  : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
              }`}
            >
              <AlertTriangle size={16} /> Incidents & Entretien
            </button>
            <button 
              onClick={() => setActiveTab('finances')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer text-left ${
                activeTab === 'finances' 
                  ? 'bg-indigo-600 text-white font-bold' 
                  : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
              }`}
            >
              <CreditCard size={16} /> Comptabilité & Budgets
            </button>
            <button 
              onClick={() => setActiveTab('ag')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer text-left ${
                activeTab === 'ag' 
                  ? 'bg-indigo-600 text-white font-bold' 
                  : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
              }`}
            >
              <Vote size={16} /> Assemblées & Votes AG
            </button>
            <button 
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer text-left ${
                activeTab === 'documents' 
                  ? 'bg-indigo-600 text-white font-bold' 
                  : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
              }`}
            >
              <FileText size={16} /> Documents Partagés
            </button>
          </nav>
        </div>

        {/* Footer actions of left bar */}
        <div className="p-5 border-t border-slate-800 space-y-4">
          <button 
            onClick={handleResetData}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-700 text-xxs text-slate-400 hover:text-rose-500 hover:border-rose-900 transition-colors rounded"
          >
            Réinitialiser données
          </button>
          
          <div className="text-[10px] text-slate-500 font-mono text-center">
            Ver v2.4.0 • 2026 UTC
          </div>
        </div>
      </aside>

      {/* 2. Right Side Main Content Compartment */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Row */}
        <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between z-30 shrink-0">
          
          {/* Interactive Property Chooser Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowBuildingDropdown(!showBuildingDropdown)}
              className="flex items-center gap-2 px-3.5 py-1.8 hover:bg-slate-55 rounded-lg text-slate-800 text-xs md:text-sm font-bold border border-slate-200 shadow-xxs transition-colors"
            >
              <Home size={14} className="text-slate-500" />
              <span>{selectedBuilding.name}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {showBuildingDropdown && (
              <div className="absolute left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 space-y-0.5 animate-in fade-in slide-in-from-top-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 font-mono">
                  Sélectionner un immeuble géré :
                </span>
                {immeubles.map((b) => (
                  <button 
                    key={b.id}
                    onClick={() => handleSelectBuilding(b)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center gap-2 ${
                      selectedBuilding.id === b.id 
                        ? 'bg-indigo-50 font-bold text-indigo-700' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Building size={14} className="text-slate-500 shrink-0" />
                    <div>
                      <p className="leading-snug">{b.name}</p>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5 max-w-[190px] truncate">{b.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick legal compliance security shield badge */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1 rounded-full text-xs font-medium text-slate-600">
              <Shield size={14} className="text-emerald-500" />
              Conforme Réglementation Copropriété Loi ALUR 2026
            </div>
            
            <div className="h-4 w-[1px] bg-slate-200 hidden lg:block" />

            {/* Simulated account context */}
            <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
              UTC 2026-06-01
            </span>
          </div>
        </header>

        {/* Core Screen View Port */}
        <main className="flex-1 overflow-y-auto p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              building={selectedBuilding}
              coproprietaires={coproprietaires}
              incidents={incidents}
              expenses={expenses}
              announcements={announcements}
              onAddAnnouncement={handleAddAnnouncement}
              onNavigateTo={setActiveTab}
            />
          )}

          {activeTab === 'coproprietaires' && (
            <Coproprietaires 
              building={selectedBuilding}
              coproprietaires={coproprietaires}
              onAddCoproprietaire={handleAddCoproprietaire}
              onUpdateBalance={handleUpdateBalance}
            />
          )}

          {activeTab === 'incidents' && (
            <Incidents 
              building={selectedBuilding}
              incidents={incidents}
              onAddIncident={handleAddIncident}
              onUpdateStatus={handleUpdateIncidentStatus}
            />
          )}

          {activeTab === 'finances' && (
            <Finances 
              building={selectedBuilding}
              coproprietaires={coproprietaires}
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onLaunchCallForFunds={handleLaunchCallForFunds}
            />
          )}

          {activeTab === 'ag' && (
            <AgVoting 
              building={selectedBuilding}
              coproprietaires={coproprietaires}
              assemblies={assemblies}
              onUpdateResolutionVotes={handleUpdateResolutionVotes}
              onUpdateAssemblyStatus={handleUpdateAssemblyStatus}
            />
          )}

          {activeTab === 'documents' && (
            <Documents 
              building={selectedBuilding}
              documents={documents}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          )}
        </main>
      </div>
    </div>
  );
}
