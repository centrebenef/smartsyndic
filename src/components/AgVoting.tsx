import React, { useState } from 'react';
import { Immeuble, Coproprietaire, AssembleeGenerale, Resolution } from '../types';
import { 
  Vote, Plus, Calendar, HelpCircle, Check, PlayCircle, 
  RefreshCw, TrendingUp, ChevronDown, Award, Users, AlertCircle 
} from 'lucide-react';

interface AgVotingProps {
  building: Immeuble;
  coproprietaires: Coproprietaire[];
  assemblies: AssembleeGenerale[];
  onUpdateResolutionVotes: (assemblyId: string, resolutionId: string, votesFor: number, votesAgainst: number, abstentions: number, status: 'Adopté' | 'Rejeté') => void;
  onUpdateAssemblyStatus: (assemblyId: string, newStatus: 'Planifiée' | 'En cours' | 'Terminée') => void;
}

export default function AgVoting({
  building,
  coproprietaires,
  assemblies,
  onUpdateResolutionVotes,
  onUpdateAssemblyStatus
}: AgVotingProps) {
  const [activeAssemblyId, setActiveAssemblyId] = useState<string | null>(null);
  const [expandedResId, setExpandedResId] = useState<string | null>(null);
  
  // Simulated votes logs to show who voted what
  const [votingLogs, setVotingLogs] = useState<{ [resId: string]: Array<{ name: string; vote: 'Pour' | 'Contre' | 'Abstention'; weight: number }> }>({});

  const buildingAssemblies = assemblies.filter(a => a.buildingId === building.id);
  const buildingCopros = coproprietaires.filter(c => c.buildingId === building.id);

  // Set first assembly active by default if none is chosen
  const activeAssembly = buildingAssemblies.find(a => a.id === activeAssemblyId) || buildingAssemblies[0];

  const handleStartAssembly = (assemblyId: string) => {
    onUpdateAssemblyStatus(assemblyId, 'En cours');
    setActiveAssemblyId(assemblyId);
  };

  const handleCloseAssembly = (assemblyId: string) => {
    onUpdateAssemblyStatus(assemblyId, 'Terminée');
  };

  // Live simulation algorithm of general assembly votes weight
  const runVoteSimulation = (assemblyId: string, resolution: Resolution) => {
    let forWeight = 0;
    let againstWeight = 0;
    let abstainWeight = 0;
    const logsList: Array<{ name: string; vote: 'Pour' | 'Contre' | 'Abstention'; weight: number }> = [];

    buildingCopros.forEach(copro => {
      // Pick random vote: 60% Pour, 30% Contre, 10% Abstention
      const rand = Math.random();
      let choice: 'Pour' | 'Contre' | 'Abstention';
      
      if (rand < 0.60) {
        choice = 'Pour';
        forWeight += copro.tantiemes;
      } else if (rand < 0.90) {
        choice = 'Contre';
        againstWeight += copro.tantiemes;
      } else {
        choice = 'Abstention';
        abstainWeight += copro.tantiemes;
      }

      logsList.push({
        name: copro.name,
        vote: choice,
        weight: copro.tantiemes
      });
    });

    // Determine status (requires simple majority of cast votes, i.e., For > Against)
    const resultStatus = forWeight > againstWeight ? 'Adopté' : 'Rejeté';

    onUpdateResolutionVotes(assemblyId, resolution.id, forWeight, againstWeight, abstainWeight, resultStatus);
    
    // Store logs
    setVotingLogs(prev => ({
      ...prev,
      [resolution.id]: logsList
    }));
  };

  return (
    <div id="ag-voting-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Vote className="text-indigo-600" size={24} />
            Assemblées Générales & Votes
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gérez les convocations aux assemblées de copropriété, soumettez des résolutions et simulez le vote en séance selon les millièmes.
          </p>
        </div>
      </div>

      {buildingAssemblies.length === 0 ? (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
          <HelpCircle className="mx-auto text-slate-300 mb-2" size={32} />
          <p className="text-sm text-slate-400">Aucune assemblée générale planifiée pour cet immeuble.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Side: Assembly List & Agenda Details */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold font-mono text-slate-400 tracking-wider uppercase">Sessions Planifiées</h3>
            
            {buildingAssemblies.map((ag) => {
              const isActive = activeAssembly?.id === ag.id;
              return (
                <div 
                  key={ag.id}
                  onClick={() => setActiveAssemblyId(ag.id)}
                  className={`p-4 border rounded-xl hover:border-slate-300 transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-200' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border">
                      SESSION-{ag.id.toUpperCase()}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                      ag.status === 'Terminée' ? 'bg-slate-150 text-slate-700' :
                      ag.status === 'En cours' ? 'bg-emerald-100 text-emerald-800 animate-pulse' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {ag.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-2.5">{ag.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    📅 {ag.date} • {buildingCopros.length} lots convoqués
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-150 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      {ag.resolutions.length} Résolution{ag.resolutions.length > 1 ? 's' : ''}
                    </span>
                    {ag.status === 'Planifiée' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartAssembly(ag.id);
                        }}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <PlayCircle size={14} /> Démarrer l'AG →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side: Interactive resolutions list and simulated vote calculation */}
          <div className="lg:col-span-2 space-y-4">
            {activeAssembly && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-4 gap-2">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{activeAssembly.title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Cliquez sur une résolution ci-dessous pour simuler ou comptabiliser le vote ponderé en direct.</p>
                  </div>
                  
                  {activeAssembly.status === 'En cours' ? (
                    <button 
                      onClick={() => handleCloseAssembly(activeAssembly.id)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold cursor-pointer"
                    >
                      🗳️ Clôturer & Enregistrer le PV
                    </button>
                  ) : activeAssembly.status === 'Terminée' ? (
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md">
                      ✓ Vote clos & signé électroniquement
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 italic">En attente d'ouverture de la session par le syndic</span>
                  )}
                </div>

                {/* Resolution Accordion / Card items */}
                <div className="space-y-4">
                  {activeAssembly.resolutions.map((res, index) => {
                    const isExpanded = expandedResId === res.id;
                    const totalVotesCast = res.votesFor + res.votesAgainst + res.abstentions;
                    const forPct = totalVotesCast > 0 ? (res.votesFor / totalVotesCast) * 100 : 0;
                    const againstPct = totalVotesCast > 0 ? (res.votesAgainst / totalVotesCast) * 100 : 0;
                    const abstainPct = totalVotesCast > 0 ? (res.abstentions / totalVotesCast) * 100 : 0;
                    
                    return (
                      <div key={res.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-xxs">
                        <div 
                          onClick={() => setExpandedResId(isExpanded ? null : res.id)}
                          className="p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold font-mono text-slate-400">RÉSOLUTION N°{index + 1}</span>
                            <h4 className="text-sm font-bold text-slate-800 leading-snug">{res.title}</h4>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {res.voteStatus !== 'En cours' && (
                              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                                res.voteStatus === 'Adopté' 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                  : 'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}>
                                {res.voteStatus}
                              </span>
                            )}
                            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-4 border-t border-slate-205/60 space-y-4">
                            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                              <span className="font-semibold block text-slate-700 mb-1">Résumé légal :</span>
                              {res.description}
                            </p>

                            {/* Votes results indicators */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs font-semibold text-slate-500">
                                <span>Réglette des suffrages exprimés (Tantièmes) :</span>
                                <span className="font-mono text-slate-900">{totalVotesCast} / {building.totalTantiemes} mill.</span>
                              </div>
                              
                              <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
                                <div style={{ width: `${forPct}%` }} className="bg-emerald-500 h-full" title="Pour" />
                                <div style={{ width: `${againstPct}%` }} className="bg-rose-500 h-full" title="Contre" />
                                <div style={{ width: `${abstainPct}%` }} className="bg-slate-400 h-full" title="Abstention" />
                              </div>

                              <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
                                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2">
                                  <p className="text-[10px] text-emerald-700 font-bold">POUR</p>
                                  <p className="text-xs font-bold text-slate-900 mt-1">{res.votesFor} millièmes</p>
                                  <p className="text-[9px] text-slate-400 font-normal">{forPct.toFixed(1)}%</p>
                                </div>
                                <div className="bg-rose-50 border border-rose-100 rounded-lg p-2">
                                  <p className="text-[10px] text-rose-700 font-bold">CONTRE</p>
                                  <p className="text-xs font-bold text-slate-900 mt-1">{res.votesAgainst} millièmes</p>
                                  <p className="text-[9px] text-slate-400 font-normal">{againstPct.toFixed(1)}%</p>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2">
                                  <p className="text-[10px] text-slate-500 font-bold">ABSTENTION</p>
                                  <p className="text-xs font-bold text-slate-900 mt-1">{res.abstentions} millièmes</p>
                                  <p className="text-[9px] text-slate-400 font-normal">{abstainPct.toFixed(1)}%</p>
                                </div>
                              </div>
                            </div>

                            {/* Core Action: Run interactive votes simulators */}
                            {activeAssembly.status === 'En cours' && (
                              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                                <button
                                  onClick={() => runVoteSimulation(activeAssembly.id, res)}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xxs transition-colors"
                                >
                                  <RefreshCw size={12} /> Simuler le scrutin (Saisie millièmes)
                                </button>
                              </div>
                            )}

                            {/* Simulated individual votes table */}
                            {votingLogs[res.id] && (
                              <div className="border border-slate-100 rounded-lg bg-slate-50/50 p-3 space-y-2 max-h-[220px] overflow-y-auto">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1">
                                  <Users size={12} /> Émargement détaillé du scrutin :
                                </p>
                                <div className="divide-y divide-slate-100">
                                  {votingLogs[res.id].map((log, lIdx) => (
                                    <div key={lIdx} className="flex justify-between items-center py-1.5 text-xs">
                                      <span className="font-semibold text-slate-700">{log.name}</span>
                                      <div className="flex items-center gap-2 font-mono">
                                        <span className="text-slate-400">({log.weight}‰)</span>
                                        <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                                          log.vote === 'Pour' ? 'bg-emerald-100 text-emerald-800' :
                                          log.vote === 'Contre' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-700'
                                        }`}>
                                          {log.vote}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
