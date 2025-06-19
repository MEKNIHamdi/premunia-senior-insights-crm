
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
  prenom?: string;
  email?: string;
  telephone?: string;
  date_naissance?: string; // Format: DD/MM/YYYY
  age?: number;
  statut: 'nouveau' | 'qualifie' | 'interesse' | 'negocie' | 'signe' | 'perdu';
  score: number;
  budget_max?: number;
  type_contrat: 'individuel' | 'couple' | 'famille';
  commercial_id?: string;
  notes?: string;
  source?: 'excel' | 'googlesheet' | 'hubspot' | 'manuel';
  source_id?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  date_creation: string;
  derniere_activite: string;
}

export interface Campaign {
  id: string;
  nom: string;
  type: 'email' | 'sms' | 'appel';
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'suspendue';
  date_lancement?: string;
  date_fin?: string;
  nb_envoyes: number;
  taux_ouverture?: number;
  nb_conversions?: number;
  contenu?: string;
  created_by: string;
}

export interface Opportunity {
  id: string;
  nom: string;
  prospect_id: string;
  valeur: number;
  statut: 'nouveau' | 'en_cours' | 'gagne' | 'perdu';
  probabilite: number;
  date_cloture_prevue?: string;
  commercial_id: string;
  notes?: string;
}

export interface Task {
  id: string;
  titre: string;
  description?: string;
  statut: 'en_attente' | 'en_cours' | 'terminee' | 'annulee';
  priorite: 'basse' | 'moyenne' | 'haute' | 'urgente';
  date_echeance?: string;
  assignee_id: string;
  prospect_id?: string;
  opportunity_id?: string;
  created_by: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  titre: string;
  description?: string;
  date_debut: string;
  date_fin: string;
  lieu?: string;
  type_rdv: 'appel' | 'visio' | 'presentiel' | 'autre';
  statut: 'planifie' | 'confirme' | 'annule' | 'reporte' | 'termine';
  commercial_id: string;
  prospect_id?: string;
  opportunity_id?: string;
  rappel_minutes: number;
  created_at: string;
}

export interface Document {
  id: string;
  nom: string;
  type?: string;
  taille_bytes?: number;
  url: string;
  prospect_id?: string;
  opportunity_id?: string;
  uploaded_by: string;
  created_at: string;
}

export interface SyncLog {
  id: string;
  source: 'googlesheet' | 'hubspot' | 'excel';
  statut: 'succes' | 'erreur' | 'en_cours';
  nb_records: number;
  message?: string;
  details?: any;
  created_by: string;
  created_at: string;
}
