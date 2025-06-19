
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'commercial';
  avatar?: string;
}

export interface Prospect {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  age: number;
  statut: 'nouveau' | 'qualifie' | 'interesse' | 'negocie' | 'signe' | 'perdu';
  score: number;
  budget_max: number;
  type_contrat: 'individuel' | 'couple' | 'famille';
  commercial_id?: string;
  date_creation: string;
  derniere_activite: string;
}

export interface Campaign {
  id: string;
  nom: string;
  type: 'email' | 'sms' | 'appel';
  statut: 'planifiee' | 'en_cours' | 'terminee';
  date_lancement: string;
  nb_envoyes: number;
  taux_ouverture?: number;
  nb_conversions?: number;
}

export interface Opportunity {
  id: string;
  nom: string;
  prospect_id: string;
  valeur: number;
  statut: 'nouveau' | 'en_cours' | 'gagne' | 'perdu';
  probabilite: number;
  date_cloture_prevue: string;
  commercial_id: string;
}
