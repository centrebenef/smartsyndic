import { Immeuble, Coproprietaire, Incident, Expense, AssembleeGenerale, Announcement, Document } from '../types';

export const INITIAL_IMMEUBLES: Immeuble[] = [
  {
    id: 'b1',
    name: 'Résidence Le Belvédère',
    address: '142 Avenue des Champs-Élysées, 75008 Paris',
    totalTantiemes: 1000,
    yearBuilt: 1974,
    unitsCount: 24,
  },
  {
    id: 'b2',
    name: 'Les Terrasses d\'Azur',
    address: '45 Boulevard de la Croisette, 06400 Cannes',
    totalTantiemes: 1000,
    yearBuilt: 1998,
    unitsCount: 16,
  },
  {
    id: 'b3',
    name: 'Villa des Marronniers',
    address: '8 Rue de la République, 69002 Lyon',
    totalTantiemes: 1000,
    yearBuilt: 1920,
    unitsCount: 8,
  }
];

export const INITIAL_COPROPRIETAIRES: Coproprietaire[] = [
  // Résidence Le Belvédère (b1)
  {
    id: 'c1',
    name: 'Jean-Pierre Dupont',
    email: 'jp.dupont@email.com',
    phone: '06 12 34 56 78',
    lotNumber: 'Lot 101 (Appt 1er G)',
    tantiemes: 120,
    balance: -450.00, // Doit de l'argent
    buildingId: 'b1',
  },
  {
    id: 'c2',
    name: 'Marie Martin',
    email: 'm.martin@email.com',
    phone: '06 98 76 54 32',
    lotNumber: 'Lot 102 (Appt 1er D)',
    tantiemes: 110,
    balance: 0.00,
    buildingId: 'b1',
  },
  {
    id: 'c3',
    name: 'Dr. Thomas Bernard',
    email: 't.bernard@cabinet.fr',
    phone: '06 45 67 89 01',
    lotNumber: 'Lot 201 (Appt 2e G & Cave 2)',
    tantiemes: 140,
    balance: 230.50, // Crédit
    buildingId: 'b1',
  },
  {
    id: 'c4',
    name: 'Sophie Lefevre',
    email: 'sophie.lefevre@email.com',
    phone: '06 23 45 67 89',
    lotNumber: 'Lot 202 (Appt 2e D)',
    tantiemes: 110,
    balance: -1200.00, // Gros impayé
    buildingId: 'b1',
  },
  {
    id: 'c5',
    name: 'Lucas Dubois',
    email: 'l.dubois@email.com',
    phone: '06 87 65 43 21',
    lotNumber: 'Lot 301 (Duplex & Garage 1)',
    tantiemes: 220,
    balance: 50.00,
    buildingId: 'b1',
  },
  {
    id: 'c6',
    name: 'Isabelle Leroy',
    email: 'i.leroy@email.com',
    phone: '06 34 56 78 90',
    lotNumber: 'Lot 302 (Duplex)',
    tantiemes: 180,
    balance: 0.00,
    buildingId: 'b1',
  },
  {
    id: 'c7',
    name: 'Cabinet Immobilier Gestim',
    email: 'contact@gestim.fr',
    phone: '01 40 50 60 70',
    lotNumber: 'Lot G1-G6 (Garages)',
    tantiemes: 120,
    balance: 150.00,
    buildingId: 'b1',
  },

  // Les Terrasses d'Azur (b2)
  {
    id: 'c8',
    name: 'François Cluzet',
    email: 'f.cluzet@cinema.fr',
    phone: '06 11 22 33 44',
    lotNumber: 'Lot 01 (Penthouse)',
    tantiemes: 350,
    balance: 1560.00,
    buildingId: 'b2',
  },
  {
    id: 'c9',
    name: 'Sarah Benamou',
    email: 'sarah.b@email.com',
    phone: '06 55 66 77 88',
    lotNumber: 'Lot 02 (Appt RDC)',
    tantiemes: 250,
    balance: -890.00,
    buildingId: 'b2',
  },
  {
    id: 'c10',
    name: 'Michel Barnier',
    email: 'm.barnier@assemblee.fr',
    phone: '06 77 88 99 00',
    lotNumber: 'Lot 03 (Appt 1er)',
    tantiemes: 400,
    balance: 0.00,
    buildingId: 'b2',
  },

  // Villa des Marronniers (b3)
  {
    id: 'c11',
    name: 'Amélie Poulain',
    email: 'amelie@montmartre.fr',
    phone: '06 00 11 22 33',
    lotNumber: 'Appt 1 (RDC)',
    tantiemes: 250,
    balance: 0.00,
    buildingId: 'b3',
  },
  {
    id: 'c12',
    name: 'Laurent Blanc',
    email: 'l.blanc@coach.fr',
    phone: '06 33 44 55 66',
    lotNumber: 'Appt 2 (1er étage)',
    tantiemes: 375,
    balance: -340.00,
    buildingId: 'b3',
  },
  {
    id: 'c13',
    name: 'Pierre Richard',
    email: 'p.richard@clown.fr',
    phone: '06 99 88 77 66',
    lotNumber: 'Appt 3 (Dernier étage)',
    tantiemes: 375,
    balance: 420.00,
    buildingId: 'b3',
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'i1',
    title: 'Panne d\'ascenseur',
    description: 'L\'ascenseur principal est bloqué au 3ème étage. La cabine ne répond plus aux appels extérieurs. Technicien OTIS prévenu par téléphone.',
    category: 'Ascenseur',
    status: 'En cours',
    priority: 'Urgente',
    dateCreated: '2026-05-30',
    buildingId: 'b1',
    reportedBy: 'Marie Martin (Appt 1er D)',
  },
  {
    id: 'i2',
    title: 'Fuite d\'eau sous-sol / caves',
    description: 'Infiltration d\'eau constatée près du mur de la cave n°4. L\'eau semble provenir de la colonne d\'évacuation générale des eaux usées.',
    category: 'Plomberie',
    status: 'Nouveau',
    priority: 'Haute',
    dateCreated: '2026-06-01',
    buildingId: 'b1',
    reportedBy: 'Lucas Dubois (Lot 301)',
  },
  {
    id: 'i3',
    title: 'Éclairage parking défaillant',
    description: 'Deux tubes néons sont complètement grillés dans l\'allée d\'accès B du parking souterrain. Zone très sombre.',
    category: 'Électricité',
    status: 'Résolu',
    priority: 'Basse',
    dateCreated: '2026-05-15',
    buildingId: 'b1',
    reportedBy: 'Jean-Pierre Dupont (Lot 101)',
  },
  {
    id: 'i4',
    title: 'Nettoyage toiture et chenaux',
    description: 'De nombreuses feuilles mortes et mousses bouchent l\'évacuation pluviale de l\'aile Ouest. Risque de débordement lors des prochaines pluies.',
    category: 'Nettoyage',
    status: 'Nouveau',
    priority: 'Moyenne',
    dateCreated: '2026-05-28',
    buildingId: 'b2',
    reportedBy: 'Michel Barnier',
  },
  {
    id: 'i5',
    title: 'Porte d\'entrée de l\'immeuble voilée',
    description: 'La serrure électromagnétique VIGIK frotte énormément sur le bâti de la porte d\'entrée en bois. Parfois, elle ne se verrouille pas correctement.',
    category: 'Autre',
    status: 'En cours',
    priority: 'Haute',
    dateCreated: '2026-05-25',
    buildingId: 'b3',
    reportedBy: 'Amélie Poulain',
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  // Résidence Le Belvédère (b1)
  {
    id: 'e1',
    title: 'Assurance multirisque immeuble AXA',
    category: 'Assurance',
    amount: 3200.00,
    date: '2026-01-15',
    status: 'Payé',
    buildingId: 'b1',
  },
  {
    id: 'e2',
    title: 'Contrat d\'entretien annuel ascenseur OTIS',
    category: 'Maintenance',
    amount: 1450.00,
    date: '2026-02-10',
    status: 'Payé',
    buildingId: 'b1',
  },
  {
    id: 'e3',
    title: 'Facture gaz collectif - CPCU',
    category: 'Énergies',
    amount: 5890.00,
    date: '2026-03-01',
    status: 'Payé',
    buildingId: 'b1',
  },
  {
    id: 'e4',
    title: 'Honoraires de syndic - Trimestre 1',
    category: 'Administration',
    amount: 1200.00,
    date: '2026-04-01',
    status: 'Payé',
    buildingId: 'b1',
  },
  {
    id: 'e5',
    title: 'Remplacement de la colonne d\'eau usée',
    category: 'Travaux',
    amount: 8500.00,
    date: '2026-05-12',
    status: 'En attente',
    buildingId: 'b1',
  },
  {
    id: 'e6',
    title: 'Intervention d\'urgence débouchage canalisation',
    category: 'Maintenance',
    amount: 450.00,
    date: '2026-05-20',
    status: 'Payé',
    buildingId: 'b1',
  },

  // Les Terrasses d'Azur (b2)
  {
    id: 'e7',
    title: 'Traitement anti-corrosion des balustrades',
    category: 'Travaux',
    amount: 4200.00,
    date: '2026-04-18',
    status: 'Payé',
    buildingId: 'b2',
  },
  {
    id: 'e8',
    title: 'Électricité des parties communes - EDF',
    category: 'Énergies',
    amount: 870.00,
    date: '2026-05-02',
    status: 'Payé',
    buildingId: 'b2',
  },

  // Villa des Marronniers (b3)
  {
    id: 'e9',
    title: 'Nettoyage hebdomadaire 2026 (Forfait trimestriel)',
    category: 'Maintenance',
    amount: 600.00,
    date: '2026-05-15',
    status: 'Payé',
    buildingId: 'b3',
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Coupure d\'eau générale temporaire',
    content: 'En raison de travaux de plomberie urgents dans le sous-sol pour réparer la fuite, l\'eau sera coupée le mardi 4 juin de 9h00 à 12h00 dans toute la résidence. Merci de prendre vos dispositions.',
    date: '2026-06-01',
    category: 'Important',
    buildingId: 'b1',
  },
  {
    id: 'a2',
    title: 'Changement de code du digicode de l\'entrée',
    content: 'À compter du 15 juin, le digicode d\'entrée de l\'immeuble sera modifié. Le nouveau code d\'accès sera 47B52. Veuillez ne pas le communiquer à des personnes tierces.',
    date: '2026-05-25',
    category: 'Information',
    buildingId: 'b1',
  },
  {
    id: 'a3',
    title: 'Prochaine assemblée générale ordinaire',
    content: 'L\'assemblée générale de la copropriété se déroulera le 28 juin à 18h00 dans la salle municipale Georges Brassens. Les convocations officielles et documents financiers vous ont été envoyés par courrier recommandé.',
    date: '2026-05-10',
    category: 'Important',
    buildingId: 'b2',
  }
];

export const INITIAL_ASSEMBLEES: AssembleeGenerale[] = [
  {
    id: 'ag1',
    title: 'Assemblée Générale Annuelle 2026',
    date: '2026-06-25',
    status: 'Planifiée',
    buildingId: 'b1',
    resolutions: [
      {
        id: 'r1',
        title: 'Approbation des comptes de l\'exercice clos 2025',
        description: 'Approbation de l\'état de répartition des charges présenté par le syndic pour l\'exercice de Janvier à Décembre 2025 de 18 540 €.',
        votesFor: 0,
        votesAgainst: 0,
        abstentions: 0,
        voteStatus: 'En cours'
      },
      {
        id: 'r2',
        title: 'Ravalement de la façade principale côté rue',
        description: 'Voter les travaux de réhabilitation thermique et ravalement de la façade de l\'immeuble. Devis proposé par l\'entreprise BATIPRO d\'un montant de 24 500 €.',
        votesFor: 0,
        votesAgainst: 0,
        abstentions: 0,
        voteStatus: 'En cours'
      },
      {
        id: 'r3',
        title: 'Reconduction du mandat du syndic actuel',
        description: 'Reconduire le mandat de gestion comptable et technique du syndic pour une durée de 12 mois aux mêmes conditions tarifaires.',
        votesFor: 0,
        votesAgainst: 0,
        abstentions: 0,
        voteStatus: 'En cours'
      }
    ]
  },
  {
    id: 'ag2',
    title: 'Assemblée Générale Ordinaire Terrasses d\'Azur',
    date: '2026-06-28',
    status: 'Planifiée',
    buildingId: 'b2',
    resolutions: [
      {
        id: 'r4',
        title: 'Mise en place de caméras de vidéo-surveillance parking',
        description: 'Sécurisation de la rampe d\'accès et de la cave. Installation de 4 caméras IP dôme haute définition.',
        votesFor: 0,
        votesAgainst: 0,
        abstentions: 0,
        voteStatus: 'En cours'
      }
    ]
  }
];

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'd1',
    title: 'Règlement de copropriété consolidé.pdf',
    category: 'Règlement',
    dateUploaded: '2025-10-12',
    fileSize: '4.2 MB',
    buildingId: 'b1',
  },
  {
    id: 'd2',
    title: 'Procès Verbal de l\'AG 2025.pdf',
    category: 'PV',
    dateUploaded: '2025-06-20',
    fileSize: '1.8 MB',
    buildingId: 'b1',
  },
  {
    id: 'd3',
    title: 'Diagnostic de performance énergétique collectif (DPE).pdf',
    category: 'Règlement',
    dateUploaded: '2026-02-14',
    fileSize: '5.1 MB',
    buildingId: 'b1',
  },
  {
    id: 'd4',
    title: 'Budget prévisionnel approuvé exercice 2026.xlsx',
    category: 'Budget',
    dateUploaded: '2026-01-05',
    fileSize: '650 KB',
    buildingId: 'b1',
  },
  {
    id: 'd5',
    title: 'Règlement d\'usage de la piscine commune.pdf',
    category: 'Règlement',
    dateUploaded: '2026-05-01',
    fileSize: '1.2 MB',
    buildingId: 'b2',
  }
];
