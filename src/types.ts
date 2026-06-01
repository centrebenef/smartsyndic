export interface Immeuble {
  id: string;
  name: string;
  address: string;
  totalTantiemes: number;
  yearBuilt: number;
  unitsCount: number;
}

export interface Coproprietaire {
  id: string;
  name: string;
  email: string;
  phone: string;
  lotNumber: string;
  tantiemes: number; // Share of ownership (e.g. out of 1000)
  balance: number; // Positive = credit, negative = unpaid dues (solde)
  buildingId: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: 'Plomberie' | 'Électricité' | 'Ascenseur' | 'Chauffage' | 'Nettoyage' | 'Autre';
  status: 'Nouveau' | 'En cours' | 'Résolu';
  priority: 'Basse' | 'Moyenne' | 'Haute' | 'Urgente';
  dateCreated: string;
  buildingId: string;
  reportedBy: string;
}

export interface Expense {
  id: string;
  title: string;
  category: 'Maintenance' | 'Énergies' | 'Assurance' | 'Administration' | 'Travaux';
  amount: number;
  date: string;
  status: 'Payé' | 'En attente' | 'Approuvé';
  buildingId: string;
}

export interface Budget {
  totalAllocated: number;
  spent: number;
  categories: {
    Maintenance: number;
    Énergies: number;
    Assurance: number;
    Administration: number;
    Travaux: number;
  };
}

export interface Resolution {
  id: string;
  title: string;
  description: string;
  votesFor: number; // in tantièmes
  votesAgainst: number; // in tantièmes
  abstentions: number; // in tantièmes
  voteStatus: 'En cours' | 'Adopté' | 'Rejeté' | 'En attente';
}

export interface AssembleeGenerale {
  id: string;
  title: string;
  date: string;
  status: 'Planifiée' | 'En cours' | 'Terminée';
  buildingId: string;
  resolutions: Resolution[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Important' | 'Travaux' | 'Information';
  buildingId: string;
}

export interface Document {
  id: string;
  title: string;
  category: 'Règlement' | 'PV' | 'Facture' | 'Budget';
  dateUploaded: string;
  fileSize: string;
  buildingId: string;
}
