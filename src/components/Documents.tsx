import React, { useState } from 'react';
import { Immeuble, Document } from '../types';
import { 
  FileText, Search, Plus, Filter, HelpCircle, 
  Download, Trash2, Calendar, HardDrive, Upload, AlertCircle
} from 'lucide-react';

interface DocumentsProps {
  building: Immeuble;
  documents: Document[];
  onAddDocument: (title: string, category: 'Règlement' | 'PV' | 'Facture' | 'Budget', fileSize: string) => void;
  onDeleteDocument: (docId: string) => void;
}

export default function Documents({
  building,
  documents,
  onAddDocument,
  onDeleteDocument
}: DocumentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Règlement' | 'PV' | 'Facture' | 'Budget'>('all');
  
  // Custom upload simulator form
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedCategory, setUploadedCategory] = useState<'Règlement' | 'PV' | 'Facture' | 'Budget'>('Règlement');
  const [dragOver, setDragOver] = useState(false);

  // Filter building-specific documents
  const buildingDocs = documents.filter(d => d.buildingId === building.id);

  // Apply search/filters
  const filteredDocs = buildingDocs.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (categoryFilter !== 'all') {
      return matchesSearch && d.category === categoryFilter;
    }
    return matchesSearch;
  });

  // Handle manual upload click
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFileName.trim()) return;

    // Auto-append .pdf if not typed
    let title = uploadedFileName.trim();
    if (!title.includes('.')) {
      title += '.pdf';
    }

    const sizes = ['1.2 MB', '850 KB', '2.4 MB', '4.1 MB', '620 KB'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];

    onAddDocument(title, uploadedCategory, randomSize);
    
    // reset form
    setUploadedFileName('');
    setUploadedCategory('Règlement');
    setShowUploadForm(false);
  };

  // Simulating drag and drop uploads
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    // Grab mock file name from transfer if possible, or just generate
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;
      
      onAddDocument(file.name, 'Règlement', sizeStr);
    } else {
      // Fallback fallback file
      onAddDocument('Nouveau_Document_Glissé.pdf', 'Règlement', '1.1 MB');
    }
  };

  return (
    <div id="documents-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="text-amber-500" size={24} />
            Espace Documentaire Partagé
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Recherchez et téléchargez les actes, règlements, appels d'offres et diagnostics officiels rattachés à la copropriété.
          </p>
        </div>
        <button 
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold cursor-pointer shadow-xs self-start sm:self-center"
        >
          <Upload size={16} /> Importer un document
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left column: Categories quick shortcuts */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold font-mono text-slate-400 tracking-wider uppercase">Dossiers d'Archives</h3>
          
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xxs space-y-1">
            <button 
              onClick={() => setCategoryFilter('all')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer ${
                categoryFilter === 'all' 
                  ? 'bg-slate-900 text-white font-bold' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>📂 Tous les Documents</span>
              <span className="font-mono text-[10px] bg-slate-100 text-slate-650 px-1.5 py-0.5 rounded font-black">{buildingDocs.length}</span>
            </button>
            <button 
              onClick={() => setCategoryFilter('Règlement')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer ${
                categoryFilter === 'Règlement' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>📄 Règlements Copro</span>
              <span className="font-mono text-[10px] bg-slate-100 text-slate-650 px-1.5 py-0.5 rounded font-bold">{buildingDocs.filter(d => d.category === 'Règlement').length}</span>
            </button>
            <button 
              onClick={() => setCategoryFilter('PV')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer ${
                categoryFilter === 'PV' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>🏛️ Procès-Verbaux d'AG</span>
              <span className="font-mono text-[10px] bg-slate-100 text-slate-650 px-1.5 py-0.5 rounded font-bold">{buildingDocs.filter(d => d.category === 'PV').length}</span>
            </button>
            <button 
              onClick={() => setCategoryFilter('Budget')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer ${
                categoryFilter === 'Budget' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>📊 Budgets & Devis</span>
              <span className="font-mono text-[10px] bg-slate-100 text-slate-650 px-1.5 py-0.5 rounded font-bold">{buildingDocs.filter(d => d.category === 'Budget').length}</span>
            </button>
            <button 
              onClick={() => setCategoryFilter('Facture')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors cursor-pointer ${
                categoryFilter === 'Facture' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>🧾 Factures & Contrats</span>
              <span className="font-mono text-[10px] bg-slate-100 text-slate-650 px-1.5 py-0.5 rounded font-bold">{buildingDocs.filter(d => d.category === 'Facture').length}</span>
            </button>
          </div>

          {/* Quick Storage Capacity Widget */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
            <h4 className="font-bold text-slate-700 flex items-center gap-1.5 mb-2">
              <HardDrive size={14} className="text-slate-500" /> Stockage Cloud Syndic
            </h4>
            <div className="w-full bg-slate-205 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-indigo-600 h-full w-[14%]" />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-mono">
              <span>7.2 MB utilisés</span>
              <span>50 MB inclus</span>
            </div>
          </div>
        </div>

        {/* Main Columns: Filter, Explorer, Upload simulator */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Upload Form Collapse */}
          {showUploadForm && (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`bg-white border rounded-xl p-6 shadow-xs transition-all duration-200 ${
                dragOver 
                  ? 'border-indigo-500 bg-indigo-50/15 ring-2 ring-indigo-500/10' 
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-2 mb-4">
                <h3 className="text-sm font-bold text-slate-900">Uploader ou Glisser un document de copropriété</h3>
                <button type="button" onClick={() => setShowUploadForm(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Drag and drop zone */}
                <div className="border-2 border-dashed border-slate-250 rounded-xl p-8 text-center bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/50 transition-colors">
                  <Upload className="text-indigo-500 animate-bounce mb-2" size={32} />
                  <p className="text-xs font-bold text-slate-800">Glissez-déposez votre pièce justificative ici</p>
                  <p className="text-[10px] text-slate-400 mt-1">Acceptés : PDF, XLSX, DOCX (Max 10 Mo)</p>
                </div>

                {/* Manual form info */}
                <form onSubmit={handleUploadSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nom du fichier</label>
                    <input 
                      type="text" 
                      placeholder="ex: PV de l'assemblée extraordinaire"
                      value={uploadedFileName}
                      onChange={e => setUploadedFileName(e.target.value)}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Dossier de classement</label>
                    <select 
                      value={uploadedCategory}
                      onChange={e => setUploadedCategory(e.target.value as any)}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none"
                    >
                      <option value="Règlement">📄 Règlements Copro</option>
                      <option value="PV">🏛️ Procès-Verbaux d'AG</option>
                      <option value="Budget">📊 Budgets & Devis</option>
                      <option value="Facture">🧾 Factures & Contrats</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowUploadForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-md"
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Ajouter au dossier
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher des archives par nom (compte, PV, diagnostic)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-sm bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-xxs"
            />
          </div>

          {/* File explorer listing */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <HelpCircle className="mx-auto text-slate-300 mb-2" size={36} />
                  <p className="text-sm">Aucun document ne correspond à votre recherche.</p>
                </div>
              ) : (
                filteredDocs.map(doc => (
                  <div key={doc.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/40 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="p-2.5 bg-amber-50 text-amber-600 rounded-lg shrink-0 mt-0.5">
                        <FileText size={18} />
                      </span>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-slate-850 leading-snug">{doc.title}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-medium font-sans">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold uppercase tracking-wider">{doc.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5"><Calendar size={10} /> Mis en ligne le {doc.dateUploaded}</span>
                          <span>•</span>
                          <span>Taille : {doc.fileSize}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Simulation : Téléchargement du fichier "${doc.title}" en cours...`);
                        }}
                        className="p-1.5 text-slate-500 hover:bg-slate-105 rounded-md hover:text-slate-800 transition-all cursor-pointer"
                        title="Télécharger"
                      >
                        <Download size={16} />
                      </a>
                      <button 
                        onClick={() => onDeleteDocument(doc.id)}
                        className="p-1.5 text-slate-400 hover:bg-rose-50 rounded-md hover:text-rose-600 transition-all cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
