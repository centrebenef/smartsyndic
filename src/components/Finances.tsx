import React, { useState } from 'react';
import { Immeuble, Coproprietaire, Expense } from '../types';
import { 
  CreditCard, Plus, HelpCircle, ArrowUpRight, 
  ArrowDownRight, TrendingUp, Check, X, ShieldAlert, FileText, Send
} from 'lucide-react';

interface FinancesProps {
  building: Immeuble;
  coproprietaires: Coproprietaire[];
  expenses: Expense[];
  onAddExpense: (newExpense: Omit<Expense, 'id' | 'buildingId'>) => void;
  onLaunchCallForFunds: (amount: number, title: string) => void;
}

export default function Finances({
  building,
  coproprietaires,
  expenses,
  onAddExpense,
  onLaunchCallForFunds
}: FinancesProps) {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showCallForm, setShowCallForm] = useState(false);

  // Expense Form inputs
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<'Maintenance' | 'Énergies' | 'Assurance' | 'Administration' | 'Travaux'>('Maintenance');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [expenseStatus, setExpenseStatus] = useState<'Payé' | 'En attente' | 'Approuvé'>('Payé');

  // Call For Funds inputs
  const [callAmount, setCallAmount] = useState('');
  const [callTitle, setCallTitle] = useState('');

  // Notification message helper
  const [notification, setNotification] = useState<string | null>(null);

  // Filter building-specific assets
  const buildingCopros = coproprietaires.filter(c => c.buildingId === building.id);
  const buildingExpenses = expenses.filter(e => e.buildingId === building.id);

  // Financial calculations
  const totalPaidExpenses = buildingExpenses
    .filter(e => e.status === 'Payé')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalPendingExpenses = buildingExpenses
    .filter(e => e.status !== 'Payé')
    .reduce((sum, e) => sum + e.amount, 0);

  // Categorized expenses
  const categoryTotals = {
    Maintenance: 0,
    Énergies: 0,
    Assurance: 0,
    Administration: 0,
    Travaux: 0,
  };

  buildingExpenses.forEach(exp => {
    if (exp.status === 'Payé') {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    }
  });

  const getCategoryThemeColor = (cat: string) => {
    switch (cat) {
      case 'Maintenance': return 'bg-blue-600';
      case 'Énergies': return 'bg-amber-500';
      case 'Assurance': return 'bg-indigo-500';
      case 'Administration': return 'bg-slate-600';
      case 'Travaux': return 'bg-rose-500';
      default: return 'bg-slate-400';
    }
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(expenseAmount);
    if (!expenseTitle.trim() || isNaN(amount) || amount <= 0 || !expenseDate) return;

    onAddExpense({
      title: expenseTitle,
      category: expenseCategory,
      amount,
      date: expenseDate,
      status: expenseStatus
    });

    setExpenseTitle('');
    setExpenseAmount('');
    setExpenseDate('');
    setExpenseStatus('Payé');
    setShowExpenseForm(false);

    setNotification("Dépense enregistrée avec succès dans le grand livre !");
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCallFundsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(callAmount);
    if (isNaN(amount) || amount <= 0 || !callTitle.trim()) return;

    onLaunchCallForFunds(amount, callTitle);
    setCallAmount('');
    setCallTitle('');
    setShowCallForm(false);

    setNotification(`L'appel de fonds global de ${amount.toLocaleString()} € a été réparti auprès de tous les copropriétaires !`);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div id="finances-section" className="space-y-6">
      {/* Visual notification banner */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-xl flex items-center justify-between font-medium">
          <span>✅ {notification}</span>
          <button onClick={() => setNotification(null)} className="text-emerald-500 hover:text-emerald-700 ml-2">✕</button>
        </div>
      )}

      {/* Main Stats Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="text-emerald-600" size={24} />
            Budget & Livre Comptable
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gérez la trésorerie générale de la copropriété. Effectuez des appels de charges proportionnels aux millièmes de chacun.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => setShowCallForm(!showCallForm)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
          >
            <Send size={13} /> Lancer un Appel de Fonds
          </button>
          <button 
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
          >
            <Plus size={13} /> Enregistrer Dépense
          </button>
        </div>
      </div>

      {/* Forms Drawer Panel */}
      {showExpenseForm && (
        <form onSubmit={handleExpenseSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs animate-in font-sans gap-4 grid grid-cols-1 md:grid-cols-4 duration-200">
          <div className="md:col-span-4 flex items-center justify-between border-b pb-2">
            <h2 className="text-sm font-bold text-slate-900">Enregistrer une facture ou dépense acquittée</h2>
            <button type="button" onClick={() => setShowExpenseForm(false)} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Désignation du prestataire / Facture</label>
            <input 
              type="text" 
              placeholder="ex: Remplacement serrure hall - ETS MARTIN"
              value={expenseTitle} 
              onChange={e => setExpenseTitle(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie budgétaire</label>
            <select 
              value={expenseCategory} 
              onChange={e => setExpenseCategory(e.target.value as any)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Maintenance">🔧 Maintenance</option>
              <option value="Énergies">⚡ Énergies / Fluides</option>
              <option value="Assurance">🛡️ Assurances</option>
              <option value="Administration">📁 Administration / Syndic</option>
              <option value="Travaux">🏗️ Travaux de copropriété</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Montant TTC (€)</label>
            <input 
              type="number" 
              step="0.01"
              min="0.01"
              placeholder="125.00"
              value={expenseAmount} 
              onChange={e => setExpenseAmount(e.target.value)}
              className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Date comptable</label>
            <input 
              type="date" 
              value={expenseDate} 
              onChange={e => setExpenseDate(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Statut du paiement</label>
            <select 
              value={expenseStatus} 
              onChange={e => setExpenseStatus(e.target.value as any)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none"
            >
              <option value="Payé">Payé (Déjà réglé par syndic)</option>
              <option value="En attente">En attente (Rapproché mais non débité)</option>
              <option value="Approuvé">Approuvé (À régler au prochain trimestre)</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-end justify-end gap-2">
            <button 
              type="button" 
              onClick={() => setShowExpenseForm(false)} 
              className="px-4 py-1.5 text-xs border border-slate-250 hover:bg-slate-50 rounded-md font-semibold"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="px-5 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-md hover:bg-emerald-700 shadow-xxs transition-colors"
            >
              Comptabiliser
            </button>
          </div>
        </form>
      )}

      {/* Appel de fonds wizard sheet */}
      {showCallForm && (
        <form onSubmit={handleCallFundsSubmit} className="bg-slate-900 text-slate-100 border border-slate-750 p-6 rounded-xl shadow-md animate-in slide-in-from-top-4 duration-300 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <span>🚀 Lancer un appel de fonds (Répartition millièmes)</span>
            </h3>
            <button type="button" onClick={() => setShowCallForm(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          
          <div className="bg-slate-800 border border-slate-750 p-4 rounded-lg text-xs leading-relaxed text-slate-300">
            💡 En lançant cet appel de fonds, le syndic va générer un débit global. Ce montant sera automatiquement imputé sur la balance de chaque copropriétaire, calculé exactement selon leurs millièmes (<span className="text-white font-mono">Quotes-parts / {building.totalTantiemes}</span>).
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Raison de l'appel de fonds</label>
              <input 
                type="text" 
                placeholder="ex: Appel de charges Provisions Trimestre 3 2026"
                value={callTitle}
                onChange={e => setCallTitle(e.target.value)}
                className="w-full text-sm bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Montant global demandé (€)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">€</span>
                <input 
                  type="number" 
                  step="50"
                  min="1"
                  placeholder="5000"
                  value={callAmount}
                  onChange={e => setCallAmount(e.target.value)}
                  className="w-full text-sm font-mono bg-slate-800 border border-slate-700 rounded-md pl-7 pr-3 py-1.5 text-white focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={() => setShowCallForm(false)} 
              className="px-4 py-1.5 text-xs text-slate-400 hover:text-white border border-slate-700 rounded-lg"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="px-5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xxs transition-colors"
            >
              Répartir et Appeler
            </button>
          </div>
        </form>
      )}

      {/* Financial health board & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Financial Indicators */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold uppercase font-mono text-slate-400 tracking-wider mb-4">Analyse budgétaire sur l'exercice en cours</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl">
                <p className="text-xs text-slate-500 font-medium font-sans">Total dépenses d'entretien payées</p>
                <p className="text-xl font-bold text-slate-900 mt-1 font-mono">
                  {totalPaidExpenses.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-2 font-semibold">
                  <TrendingUp size={12} /> Factures réglées en temps
                </div>
              </div>
              <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl">
                <p className="text-xs text-slate-500 font-medium font-sans">Dépenses engagées non-soldées</p>
                <p className="text-xl font-bold text-slate-900 mt-1 font-mono">
                  {totalPendingExpenses.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </p>
                <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 mt-2 rounded-full font-semibold border border-amber-100 inline-block font-sans">
                  En attente validation syndic
                </span>
              </div>
            </div>

            {/* Visual breakdown horizontal bar */}
            <div className="mt-8">
              <h4 className="text-xs font-bold text-slate-700 mb-3">Ventilation des Charges Acquittées</h4>
              <div className="h-4 w-full bg-slate-100 rounded-full flex overflow-hidden">
                {Object.keys(categoryTotals).map((cat) => {
                  const amount = categoryTotals[cat as keyof typeof categoryTotals] || 0;
                  const pct = totalPaidExpenses > 0 ? (amount / totalPaidExpenses) * 100 : 0;
                  if (pct === 0) return null;
                  return (
                    <div 
                      key={cat} 
                      style={{ width: `${pct}%` }} 
                      className={`${getCategoryThemeColor(cat)} h-full hover:opacity-90 transition-opacity`}
                      title={`${cat}: ${amount.toFixed(2)}€ (${pct.toFixed(1)}%)`}
                    />
                  );
                })}
              </div>
              
              {/* Category labels */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
                {Object.keys(categoryTotals).map((cat) => {
                  const amount = categoryTotals[cat as keyof typeof categoryTotals] || 0;
                  return (
                    <div key={cat} className="flex items-start gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-sm mt-0.5 ${getCategoryThemeColor(cat)}`} />
                      <div>
                        <p className="text-[10px] font-bold text-slate-700 leading-none">{cat}</p>
                        <p className="text-xs font-semibold font-mono text-slate-500 mt-1">{amount} €</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="py-4 px-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>📋 Grand livre des dépenses et règlements</span>
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                    <th className="py-3.5 px-6">Dépense / Prestataire</th>
                    <th className="py-3.5 px-4 font-sans">Catégorie</th>
                    <th className="py-3.5 px-4 text-center">Date</th>
                    <th className="py-3.5 px-4 text-center">Statut</th>
                    <th className="py-3.5 px-6 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {buildingExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-sans">
                        <HelpCircle className="mx-auto text-slate-300 mb-2" size={32} />
                        <p className="text-sm">Aucune écriture comptable enregistrée pour le moment.</p>
                      </td>
                    </tr>
                  ) : (
                    buildingExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-800 text-sm">{exp.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">RÉF-DEP{exp.id.toUpperCase()}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${getCategoryThemeColor(exp.category)}`}>
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center text-xs font-medium font-sans text-slate-500">
                          {exp.date}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                            exp.status === 'Payé' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : exp.status === 'En attente' 
                                ? 'bg-amber-50 text-amber-800 border-amber-100' 
                                : 'bg-blue-50 text-blue-700 border-blue-105'
                          }`}>
                            {exp.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-slate-900 font-mono text-[13px]">
                          -{exp.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Coowners Balances & reminder tools */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="font-bold text-slate-950 text-base mb-1">Pointage Solde Copropriétaires</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Voici l'état des soldes de l'ensemble des copropriétaires de l'immeuble. Utilisez ces données pour effectuer des relances.
            </p>

            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {buildingCopros.map(copro => (
                <div key={copro.id} className="flex justify-between items-center text-xs py-2 border-b border-slate-100 last:border-b-0">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">{copro.name}</p>
                    <p className="text-[10px] text-slate-400">{copro.lotNumber} ({copro.tantiemes} / {building.totalTantiemes} mil.)</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-bold text-xs ${
                      copro.balance < 0 ? 'text-rose-600' : copro.balance > 0 ? 'text-emerald-600' : 'text-slate-500'
                    }`}>
                      {copro.balance > 0 ? `+${copro.balance.toFixed(2)} €` : `${copro.balance.toFixed(2)} €`}
                    </p>
                    {copro.balance < 0 && (
                      <span className="text-[9px] text-rose-500 font-medium tracking-tight">Rappel dû</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Informational Box */}
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
            <h3 className="text-indigo-900 text-xs font-bold flex items-center gap-1.5 mb-1">
              <ShieldAlert size={14} />
              Rappel Législation Copropriété
            </h3>
            <p className="text-[11px] text-indigo-700 leading-relaxed">
              La loi SRU et la loi ALUR imposent au syndic la mise à disposition d'un carnet d'entretien numérique accessible à l'ensemble du conseil syndical de l'immeuble.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
