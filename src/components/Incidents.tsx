import React, { useState } from 'react';
import { Immeuble, Incident } from '../types';
import { 
  AlertTriangle, Filter, Search, Plus, 
  Clock, CheckCircle, AlertOctagon, HelpCircle, 
  MapPin, User, ChevronRight, Check
} from 'lucide-react';

interface IncidentsProps {
  building: Immeuble;
  incidents: Incident[];
  onAddIncident: (newIncident: Omit<Incident, 'id' | 'buildingId' | 'dateCreated'>) => void;
  onUpdateStatus: (incidentId: string, newStatus: 'Nouveau' | 'En cours' | 'Résolu') => void;
}

export default function Incidents({
  building,
  incidents,
  onAddIncident,
  onUpdateStatus
}: IncidentsProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Nouveau' | 'En cours' | 'Résolu'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // New incident inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Plomberie' | 'Électricité' | 'Ascenseur' | 'Chauffage' | 'Nettoyage' | 'Autre'>('Autre');
  const [priority, setPriority] = useState<'Basse' | 'Moyenne' | 'Haute' | 'Urgente'>('Moyenne');
  const [reportedBy, setReportedBy] = useState('');

  const buildingIncidents = incidents.filter(i => i.buildingId === building.id);

  const filteredIncidents = buildingIncidents.filter(i => {
    const matchesSearch = 
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      i.reportedBy.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter !== 'all') {
      return matchesSearch && i.status === statusFilter;
    }
    return matchesSearch;
  });

  const getPriorityBadgeColors = (p: string) => {
    switch (p) {
      case 'Urgente': return 'bg-red-100 text-red-800 border-red-200';
      case 'Haute': return 'bg-orange-100 text-orange-850 border-orange-200';
      case 'Moyenne': return 'bg-blue-100 text-blue-800 border-blue-250';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadgeColors = (s: string) => {
    switch (s) {
      case 'Résolu': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'En cours': return 'bg-amber-50 text-amber-800 border-amber-100';
      default: return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !reportedBy.trim()) return;

    onAddIncident({
      title,
      description,
      category,
      priority,
      reportedBy,
      status: 'Nouveau'
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setCategory('Autre');
    setPriority('Moyenne');
    setReportedBy('');
    setShowAddForm(false);
  };

  return (
    <div id="incidents-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="text-rose-500" size={24} />
            Carnet d'Entretien & Incidents
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Déclarez de nouveaux incidents d'immeuble et suivez la planification des interventions des techniciens de maintenance.
          </p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold cursor-pointer shadow-xs self-start sm:self-center"
        >
          <Plus size={16} /> Signaler un incident
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs gap-4 grid grid-cols-1 md:grid-cols-2 animate-in fade-in slide-in-from-top-3 duration-250">
          <div className="md:col-span-2 flex items-center justify-between border-b border-slate-150 pb-2">
            <h2 className="text-base font-bold text-slate-900">Signaler un nouvel incident sur l'immeuble</h2>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 font-bold p-1">✕</button>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Intitulé court de l'incident</label>
            <input 
              type="text" 
              placeholder="ex: Panne éclairage minuterie escalier Ouest"
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Qui déclare l'incident ? (Nom & Lot)</label>
            <input 
              type="text" 
              placeholder="ex: Isabelle Leroy (Duplex 302)"
              value={reportedBy} 
              onChange={e => setReportedBy(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie technique</label>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value as any)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            >
              <option value="Plomberie">💧 Plomberie / Infiltration</option>
              <option value="Électricité">⚡ Électricité / Éclairage</option>
              <option value="Ascenseur">🛗 Ascenseur principal</option>
              <option value="Chauffage">🔥 Chauffage collectif</option>
              <option value="Nettoyage">🧹 Propreté & Nettoyage</option>
              <option value="Autre">📦 Autre catégorie</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Niveau de Priorité et d'Urgence</label>
            <select 
              value={priority} 
              onChange={e => setPriority(e.target.value as any)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
            >
              <option value="Basse">Basse (Simple usure ou confort secondaire)</option>
              <option value="Moyenne">Moyenne (Besoin de réparation sous huitaine)</option>
              <option value="Haute">Haute (Infiltration, serrurerie, panne éclairage nuit)</option>
              <option value="Urgente">Urgente (Panne ascenseur, inondation, coupure totale chauffage)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Détails de l'incident (localisation, constatations...)</label>
            <textarea 
              rows={3}
              placeholder="Décrivez avec précision la panne, le bruit, l'odeur ou les constatations visibles par les copropriétaires..."
              value={description} 
              onChange={e => setDescription(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
              required
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)} 
              className="px-4 py-2 text-sm border border-slate-250 hover:bg-slate-50 rounded-md font-semibold font-sans"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 shadow-xxs transition-colors"
            >
              Déclarer au conseil syndical
            </button>
          </div>
        </form>
      )}

      {/* Search and Filters bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par mot-clé (fuite, ascenseur, etc.)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-sm bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none shadow-xxs"
          />
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <button 
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === 'all' 
                ? 'bg-slate-900 border-slate-950 text-white' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
            }`}
          >
            Tous les incidents
          </button>
          <button 
            onClick={() => setStatusFilter('Nouveau')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === 'Nouveau' 
                ? 'bg-indigo-600 border-indigo-650 text-white' 
                : 'bg-indigo-50/50 text-indigo-700 hover:bg-indigo-50 border-indigo-100'
            }`}
          >
            Nouveaux ({buildingIncidents.filter(i => i.status === 'Nouveau').length})
          </button>
          <button 
            onClick={() => setStatusFilter('En cours')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === 'En cours' 
                ? 'bg-amber-600 border-amber-650 text-white' 
                : 'bg-amber-50/50 text-amber-800 hover:bg-amber-50 border-amber-100'
            }`}
          >
            Intervention en cours ({buildingIncidents.filter(i => i.status === 'En cours').length})
          </button>
          <button 
            onClick={() => setStatusFilter('Résolu')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === 'Résolu' 
                ? 'bg-emerald-600 border-emerald-650 text-white' 
                : 'bg-emerald-50/50 text-emerald-700 hover:bg-emerald-50 border-emerald-100'
            }`}
          >
            Résolus ({buildingIncidents.filter(i => i.status === 'Résolu').length})
          </button>
        </div>
      </div>

      {/* Incidents Listing Grid */}
      <div className="space-y-4">
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
            <HelpCircle className="mx-auto text-slate-300 mb-2" size={40} />
            <h3 className="text-slate-800 font-bold text-sm">Aucun incident à déclarer</h3>
            <p className="text-slate-400 text-xs px-4 mt-1">
              Félicitations ! Aucun incident actif ne correspond à vos filtres sur cette copropriété.
            </p>
          </div>
        ) : (
          filteredIncidents.map((inc) => (
            <div 
              key={inc.id} 
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xxs hover:shadow-xs transition-shadow flex flex-col md:flex-row md:items-start md:justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadgeColors(inc.priority)}`}>
                    ⚠️ Priorité {inc.priority}
                  </span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 font-mono">
                    ID-{inc.id.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto md:ml-0">
                    📅 Signalé le {inc.dateCreated}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{inc.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-3xl whitespace-pre-wrap">{inc.description}</p>
                
                <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-sm"><MapPin size={13} /> Catégorie : {inc.category}</span>
                  <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-sm"><User size={13} /> Déclaré par : {inc.reportedBy}</span>
                </div>
              </div>

              {/* Status Update / Action Section */}
              <div className="border-t md:border-t-0 pt-4 md:pt-0 md:pl-6 border-slate-100 flex flex-col gap-2 min-w-[200px]">
                <div className="flex items-center justify-between md:justify-start gap-2 mb-2">
                  <span className="text-xs text-slate-400 font-medium font-sans">Statut de la panne :</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadgeColors(inc.status)}`}>
                    {inc.status}
                  </span>
                </div>

                <div className="flex gap-1">
                  {inc.status !== 'Nouveau' && (
                    <button 
                      onClick={() => onUpdateStatus(inc.id, 'Nouveau')}
                      className="flex-1 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 py-1.5 px-2 rounded-md transition-colors"
                    >
                      Remettre à Neuf
                    </button>
                  )}
                  {inc.status === 'Nouveau' && (
                    <button 
                      onClick={() => onUpdateStatus(inc.id, 'En cours')}
                      className="flex-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-100 py-1.5 px-2 rounded-md transition-colors"
                    >
                      Démarrer l'intervention
                    </button>
                  )}
                  {inc.status === 'En cours' && (
                    <button 
                      onClick={() => onUpdateStatus(inc.id, 'Résolu')}
                      className="flex-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 py-1.5 px-2 rounded-md transition-colors flex items-center justify-center gap-1"
                    >
                      <Check size={11} /> Résoudre
                    </button>
                  )}
                  {inc.status === 'Résolu' && (
                    <button 
                      onClick={() => onUpdateStatus(inc.id, 'En cours')}
                      className="flex-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 py-1.5 px-2 rounded-md transition-colors"
                    >
                      Ré-ouvrir
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
