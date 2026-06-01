import React, { useState } from 'react';
import { Immeuble, Coproprietaire } from '../types';
import { 
  Users, Search, Filter, Plus, ArrowUpRight, 
  Mail, Phone, HelpCircle, Check, X, FileMinus, FilePlus
} from 'lucide-react';

interface CoproprietairesProps {
  building: Immeuble;
  coproprietaires: Coproprietaire[];
  onAddCoproprietaire: (newCopro: Omit<Coproprietaire, 'id' | 'buildingId'>) => void;
  onUpdateBalance: (coproId: string, amount: number, isCharge: boolean) => void;
}

export default function Coproprietaires({
  building,
  coproprietaires,
  onAddCoproprietaire,
  onUpdateBalance
}: CoproprietairesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [balanceFilter, setBalanceFilter] = useState<'all' | 'unpaid' | 'credit'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New coowner form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [tantiemes, setTantiemes] = useState(50);

  // Manual payment adjustment state
  const [selectedCoproId, setSelectedCoproId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [isCharge, setIsCharge] = useState(false); // charge (+) vs payment/credit (-)

  // Filter building-specific co-owners
  const buildingCopros = coproprietaires.filter(c => c.buildingId === building.id);

  // Apply search & filters
  const filteredCopros = buildingCopros.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lotNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (balanceFilter === 'unpaid') {
      return matchesSearch && c.balance < 0;
    }
    if (balanceFilter === 'credit') {
      return matchesSearch && c.balance > 0;
    }
    return matchesSearch;
  });

  // Calculate sum of parts
  const currentTotalTantiemes = buildingCopros.reduce((sum, c) => sum + c.tantiemes, 0);

  // Handle add co-owner submission
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || tantiemes <= 0) return;
    onAddCoproprietaire({
      name,
      email,
      phone,
      lotNumber,
      tantiemes: Number(tantiemes),
      balance: 0
    });
    // clean up form
    setName('');
    setEmail('');
    setPhone('');
    setLotNumber('');
    setTantiemes(50);
    setShowAddForm(false);
  };

  // Adjust balance
  const handleAdjustBalanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoproId || !adjustAmount) return;
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    onUpdateBalance(selectedCoproId, amount, isCharge);
    setAdjustAmount('');
    setSelectedCoproId(null);
  };

  return (
    <div id="coproprietaires-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="text-indigo-600" size={24} />
            Membres de la Copropriété
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Visualisez et gérez les {buildingCopros.length} lots de copropriétaires et leurs quotes-parts de tantièmes ({currentTotalTantiemes} / {building.totalTantiemes}).
          </p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold cursor-pointer shadow-xs self-start sm:self-center"
        >
          <Plus size={16} /> Nouveau Copropriétaire
        </button>
      </div>

      {/* Add New Copro Form Drawer / Collapse */}
      {showAddForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Ajouter un nouveau copropriétaire</h2>
            <button 
              onClick={() => setShowAddForm(false)} 
              className="text-slate-400 hover:text-slate-600 rounded-md p-1"
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nom complet</label>
              <input 
                type="text" 
                placeholder="M. ou Mme Prénom Nom"
                value={name} 
                onChange={e => setName(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-650"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse E-mail</label>
              <input 
                type="email" 
                placeholder="nom@exemple.com"
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-650"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">N° de mobile</label>
              <input 
                type="text" 
                placeholder="06 00 00 00 00"
                value={phone} 
                onChange={e => setPhone(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">N° de Lot & Description</label>
              <input 
                type="text" 
                placeholder="ex: Lot 203 (Appt & Parking B6)"
                value={lotNumber} 
                onChange={e => setLotNumber(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Quotes-Parts (Tantièmes / {building.totalTantiemes})</label>
              <input 
                type="number" 
                min="1" 
                max={building.totalTantiemes}
                value={tantiemes} 
                onChange={e => setTantiemes(Math.max(1, Number(e.target.value)))}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                required
              />
            </div>
            <div className="flex items-end gap-2 md:col-span-1">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-sm font-semibold rounded-md hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un copropriétaire par nom, email, n° de lot..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-sm bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 shadow-xxs"
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setBalanceFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
              balanceFilter === 'all' 
                ? 'bg-slate-900 text-white border-slate-905' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
            }`}
          >
            Tous les lots
          </button>
          <button 
            onClick={() => setBalanceFilter('unpaid')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 ${
              balanceFilter === 'unpaid' 
                ? 'bg-rose-600 text-white border-rose-600 shadow-xxs' 
                : 'bg-white text-rose-650 hover:bg-rose-50 border-slate-200'
            }`}
          >
            Impayés <span className="p-0.5 bg-rose-100 text-rose-800 text-[10px] rounded-sm font-bold">{buildingCopros.filter(c => c.balance < 0).length}</span>
          </button>
          <button 
            onClick={() => setBalanceFilter('credit')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1 ${
              balanceFilter === 'credit' 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xxs' 
                : 'bg-white text-emerald-650 hover:bg-emerald-50 border-slate-200'
            }`}
          >
            Crédits
          </button>
        </div>
      </div>

      {/* Main Co-owners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Table of Coproprietaires */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  <th className="py-3.5 px-4">Copropriétaire</th>
                  <th className="py-3.5 px-4">Lot(s) occupés</th>
                  <th className="py-3.5 px-4 text-center">Tantièmes</th>
                  <th className="py-3.5 px-4 text-right">État financier</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCopros.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-sans">
                      <HelpCircle className="mx-auto text-slate-300 mb-2" size={32} />
                      <p className="text-sm">Aucun copropriétaire trouvé avec ces critères.</p>
                    </td>
                  </tr>
                ) : (
                  filteredCopros.map((copro) => (
                    <tr 
                      key={copro.id} 
                      className={`hover:bg-slate-50/50 transition-colors ${
                        selectedCoproId === copro.id ? 'bg-indigo-50/30' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-tight">{copro.name}</p>
                          <div className="flex flex-col gap-0.5 mt-1 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1"><Mail size={10} /> {copro.email}</span>
                            {copro.phone && <span className="flex items-center gap-1"><Phone size={10} /> {copro.phone}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[12px] font-medium text-slate-600 font-sans">
                        {copro.lotNumber}
                      </td>
                      <td className="py-4 px-4 text-center font-semibold font-mono text-[13px]">
                        <span className="text-slate-800">{copro.tantiemes}</span>
                        <span className="text-slate-400 font-normal"> / {building.totalTantiemes}</span>
                        <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                          {((copro.tantiemes / building.totalTantiemes) * 100).toFixed(1)}% de part
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-1 rounded-full ${
                          copro.balance < 0 
                            ? 'bg-rose-50 text-rose-700' 
                            : copro.balance > 0 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-slate-100 text-slate-600'
                        }`}>
                          {copro.balance === 0 
                            ? 'À jour' 
                            : copro.balance > 0 
                              ? `+${copro.balance.toFixed(2)} €` 
                              : `${copro.balance.toFixed(2)} €`}
                        </span>
                        {copro.balance < 0 && (
                          <p className="text-[10px] text-rose-500 mt-1 font-sans font-medium">À régulariser de suite</p>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button 
                          onClick={() => setSelectedCoproId(selectedCoproId === copro.id ? null : copro.id)}
                          className={`px-3 py-1.5 text-xs rounded-md font-semibold transition-colors cursor-pointer ${
                            selectedCoproId === copro.id 
                              ? 'bg-slate-200 text-slate-700' 
                              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                          }`}
                        >
                          Régler/Imputer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Quick balance adjusting ledger */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs h-fit">
          <h3 className="font-bold text-slate-950 text-base mb-2">Comptabilité & Appels Individuels</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Ajustez manuellement le solde d'un copropriétaire. Créditez pour enregistrer un paiement reçu, ou débitez pour imputer des charges exceptionnelles.
          </p>

          {selectedCoproId ? (
            (() => {
              const selectedCopro = coproprietaires.find(c => c.id === selectedCoproId);
              if (!selectedCopro) return null;
              return (
                <form onSubmit={handleAdjustBalanceSubmit} className="space-y-4 border border-indigo-100 bg-indigo-50/20 rounded-xl p-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Calculateur de Dettes</span>
                    <button 
                      type="button" 
                      onClick={() => setSelectedCoproId(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{selectedCopro.name}</h4>
                    <p className="text-xs text-slate-400">Actuel: {selectedCopro.balance.toFixed(2)} €</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button" 
                      onClick={() => setIsCharge(false)}
                      className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                        !isCharge 
                          ? 'bg-emerald-600 text-white border-emerald-650' 
                          : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      🟢 Paiement Reçu (-)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsCharge(true)}
                      className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                        isCharge 
                          ? 'bg-rose-600 text-white border-rose-650' 
                          : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      🔴 Charge Imputée (+)
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Montant (€)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">€</span>
                      <input 
                        type="number" 
                        step="0.01"
                        min="0.01"
                        placeholder="180.00"
                        value={adjustAmount} 
                        onChange={e => setAdjustAmount(e.target.value)} 
                        className="w-full text-sm font-mono bg-white border border-slate-200 rounded-md pl-7 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setSelectedCoproId(null)}
                      className="flex-1 py-1.5 text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit" 
                      className={`flex-1 py-1.5 text-xs font-bold text-white rounded-md transition-colors ${
                        isCharge ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      {isCharge ? 'Appeler la charge' : 'Recevoir le paiement'}
                    </button>
                  </div>
                </form>
              );
            })()
          ) : (
            <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
              <Users className="mx-auto text-slate-300 mb-3" size={28} />
              <p className="text-xs text-slate-400 px-4">
                Sélectionnez un copropriétaire dans la liste en cliquant sur son bouton <span className="font-semibold">"Régler/Imputer"</span> pour saisir une transaction.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
