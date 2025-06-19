
import { createClient } from '@supabase/supabase-js';
import { Prospect, Task, Appointment, Campaign, Document, SyncLog } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Prospects API
export const prospectsApi = {
  async getAll(): Promise<Prospect[]> {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getByCommercial(commercialId: string): Promise<Prospect[]> {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .eq('commercial_id', commercialId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(prospect: Omit<Prospect, 'id' | 'created_at' | 'updated_at'>): Promise<Prospect> {
    const { data, error } = await supabase
      .from('prospects')
      .insert([prospect])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Prospect>): Promise<Prospect> {
    const { data, error } = await supabase
      .from('prospects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('prospects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async importFromExcel(file: File, commercialId: string): Promise<{ success: number; errors: string[] }> {
    // TODO: Implémenter le parsing Excel
    // Pour l'instant, simulation
    return { success: 10, errors: [] };
  },

  async syncFromGoogleSheets(sheetUrl: string, commercialId: string): Promise<{ success: number; errors: string[] }> {
    // TODO: Implémenter la synchronisation Google Sheets
    return { success: 5, errors: [] };
  },

  async syncFromHubSpot(apiKey: string, commercialId: string): Promise<{ success: number; errors: string[] }> {
    // TODO: Implémenter la synchronisation HubSpot
    return { success: 15, errors: [] };
  }
};

// Tasks API
export const tasksApi = {
  async getAll(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('date_echeance', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getByAssignee(assigneeId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('assignee_id', assigneeId)
      .order('date_echeance', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getOverdue(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .lt('date_echeance', new Date().toISOString())
      .neq('statut', 'terminee')
      .order('date_echeance', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async create(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Appointments API
export const appointmentsApi = {
  async getAll(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date_debut', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getByCommercial(commercialId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('commercial_id', commercialId)
      .order('date_debut', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getUpcoming(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .gte('date_debut', new Date().toISOString())
      .neq('statut', 'annule')
      .order('date_debut', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async create(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Documents API
export const documentsApi = {
  async uploadFile(file: File, prospectId?: string, opportunityId?: string): Promise<Document> {
    // Upload vers Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Créer l'entrée en base
    const { data, error } = await supabase
      .from('documents')
      .insert([{
        nom: file.name,
        type: file.type,
        taille_bytes: file.size,
        url: uploadData.path,
        prospect_id: prospectId,
        opportunity_id: opportunityId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getByProspect(prospectId: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('prospect_id', prospectId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

// Sync Logs API
export const syncLogsApi = {
  async create(log: Omit<SyncLog, 'id' | 'created_at'>): Promise<SyncLog> {
    const { data, error } = await supabase
      .from('sync_logs')
      .insert([log])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getRecent(limit: number = 10): Promise<SyncLog[]> {
    const { data, error } = await supabase
      .from('sync_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  }
};

// Analytics API
export const analyticsApi = {
  async getProspectStats() {
    const { data, error } = await supabase
      .from('prospects')
      .select('statut, score, budget_max, type_contrat');
    
    if (error) throw error;
    
    // Calculer les statistiques
    const stats = {
      total: data.length,
      byStatus: data.reduce((acc, p) => {
        acc[p.statut] = (acc[p.statut] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      avgScore: data.reduce((sum, p) => sum + p.score, 0) / data.length,
      avgBudget: data.reduce((sum, p) => sum + (p.budget_max || 0), 0) / data.length
    };
    
    return stats;
  },

  async getTaskStats() {
    const { data, error } = await supabase
      .from('tasks')
      .select('statut, priorite, date_echeance');
    
    if (error) throw error;
    
    const now = new Date();
    const overdue = data.filter(t => 
      t.date_echeance && 
      new Date(t.date_echeance) < now && 
      t.statut !== 'terminee'
    ).length;
    
    return {
      total: data.length,
      overdue,
      byStatus: data.reduce((acc, t) => {
        acc[t.statut] = (acc[t.statut] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
};
