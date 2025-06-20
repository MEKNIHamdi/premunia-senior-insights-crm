
import { supabase } from '@/integrations/supabase/client';

// Types pour l'automatisation marketing
export interface AutomationScenario {
  id: string;
  nom: string;
  description?: string;
  type: 'email_bienvenue' | 'relance_email' | 'anniversaire' | 'cross_selling' | 'personnalise';
  statut: 'actif' | 'inactif' | 'brouillon';
  conditions?: any;
  actions?: any;
  delai_minutes: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  nom: string;
  sujet: string;
  contenu_html: string;
  contenu_text?: string;
  variables?: any;
  type: 'bienvenue' | 'relance' | 'anniversaire' | 'cross_selling' | 'personnalise';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CommercialObjective {
  id: string;
  commercial_id: string;
  periode_type: 'mensuel' | 'trimestriel' | 'annuel';
  periode_valeur: string;
  objectif_ca?: number;
  objectif_prospects?: number;
  objectif_conversions?: number;
  objectif_rdv?: number;
  ca_realise: number;
  prospects_realises: number;
  conversions_realisees: number;
  rdv_realises: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PerformanceStat {
  id: string;
  commercial_id: string;
  date_stat: string;
  prospects_nouveaux: number;
  prospects_convertis: number;
  ca_genere: number;
  appels_effectues: number;
  emails_envoyes: number;
  rdv_planifies: number;
  rdv_honores: number;
  taux_conversion?: number;
  created_at: string;
}

// API pour les scénarios d'automatisation
export const automationScenariosApi = {
  async getAll(): Promise<AutomationScenario[]> {
    try {
      const { data, error } = await supabase
        .from('automation_scenarios')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        type: item.type as AutomationScenario['type'],
        statut: item.statut as AutomationScenario['statut']
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des scénarios:', error);
      return [];
    }
  },

  async create(scenario: Omit<AutomationScenario, 'id' | 'created_at' | 'updated_at'>): Promise<AutomationScenario> {
    const { data, error } = await supabase
      .from('automation_scenarios')
      .insert([scenario])
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      type: data.type as AutomationScenario['type'],
      statut: data.statut as AutomationScenario['statut']
    };
  },

  async update(id: string, updates: Partial<AutomationScenario>): Promise<AutomationScenario> {
    const { data, error } = await supabase
      .from('automation_scenarios')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      type: data.type as AutomationScenario['type'],
      statut: data.statut as AutomationScenario['statut']
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('automation_scenarios')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// API pour les templates d'emails
export const emailTemplatesApi = {
  async getAll(): Promise<EmailTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        type: item.type as EmailTemplate['type']
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des templates:', error);
      return [];
    }
  },

  async getByType(type: EmailTemplate['type']): Promise<EmailTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        type: item.type as EmailTemplate['type']
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des templates par type:', error);
      return [];
    }
  },

  async create(template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .insert([template])
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      type: data.type as EmailTemplate['type']
    };
  },

  async update(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      type: data.type as EmailTemplate['type']
    };
  }
};

// API pour les objectifs commerciaux
export const commercialObjectivesApi = {
  async getAll(): Promise<CommercialObjective[]> {
    try {
      const { data, error } = await supabase
        .from('commercial_objectives')
        .select('*')
        .order('periode_valeur', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        periode_type: item.periode_type as CommercialObjective['periode_type']
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des objectifs:', error);
      return [];
    }
  },

  async getByCommercial(commercialId: string): Promise<CommercialObjective[]> {
    try {
      const { data, error } = await supabase
        .from('commercial_objectives')
        .select('*')
        .eq('commercial_id', commercialId)
        .order('periode_valeur', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        periode_type: item.periode_type as CommercialObjective['periode_type']
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des objectifs par commercial:', error);
      return [];
    }
  },

  async create(objective: Omit<CommercialObjective, 'id' | 'created_at' | 'updated_at'>): Promise<CommercialObjective> {
    const { data, error } = await supabase
      .from('commercial_objectives')
      .insert([objective])
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      periode_type: data.periode_type as CommercialObjective['periode_type']
    };
  },

  async update(id: string, updates: Partial<CommercialObjective>): Promise<CommercialObjective> {
    const { data, error } = await supabase
      .from('commercial_objectives')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      periode_type: data.periode_type as CommercialObjective['periode_type']
    };
  }
};

// API pour les statistiques de performance
export const performanceStatsApi = {
  async getByCommercial(commercialId: string, dateFrom?: string, dateTo?: string): Promise<PerformanceStat[]> {
    try {
      let query = supabase
        .from('performance_stats')
        .select('*')
        .eq('commercial_id', commercialId);

      if (dateFrom) query = query.gte('date_stat', dateFrom);
      if (dateTo) query = query.lte('date_stat', dateTo);

      const { data, error } = await query.order('date_stat', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des stats par commercial:', error);
      return [];
    }
  },

  async getAllStats(dateFrom?: string, dateTo?: string): Promise<PerformanceStat[]> {
    try {
      let query = supabase
        .from('performance_stats')
        .select('*');

      if (dateFrom) query = query.gte('date_stat', dateFrom);
      if (dateTo) query = query.lte('date_stat', dateTo);

      const { data, error } = await query.order('date_stat', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des stats globales:', error);
      return [];
    }
  },

  async upsertStat(stat: Omit<PerformanceStat, 'id' | 'created_at'>): Promise<PerformanceStat> {
    const { data, error } = await supabase
      .from('performance_stats')
      .upsert([stat], { 
        onConflict: 'commercial_id,date_stat',
        ignoreDuplicates: false 
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// API pour les événements marketing
export const marketingEventsApi = {
  async create(event: {
    type_evenement: string;
    prospect_id?: string;
    client_id?: string;
    commercial_id?: string;
    scenario_id?: string;
    donnees_evenement?: any;
  }): Promise<void> {
    const { error } = await supabase
      .from('marketing_events')
      .insert([event]);
    
    if (error) throw error;
  },

  async getRecentEvents(limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('marketing_events')
        .select('*')
        .order('date_evenement', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des événements récents:', error);
      return [];
    }
  }
};
