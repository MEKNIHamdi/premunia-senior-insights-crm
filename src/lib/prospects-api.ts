
import { supabase } from '@/integrations/supabase/client';

export interface ProspectData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  status?: string;
  priority?: string;
  expected_revenue?: number;
  interest_type?: string;
  assigned_to?: string;
  notes?: string;
  source?: string;
}

export const prospectsApi = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .select(`
          *,
          assigned_to_profile:profiles!prospects_assigned_to_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur lors du chargement des prospects:', error);
        throw error;
      }
      
      // Ajouter les champs manquants pour la compatibilité
      return (data || []).map(prospect => ({
        ...prospect,
        birth_date: prospect.birth_date || null
      }));
    } catch (error) {
      console.error('Erreur API prospects:', error);
      return [];
    }
  },

  async getByAssignee(assigneeId: string) {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .eq('assigned_to', assigneeId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur lors du chargement des prospects assignés:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Erreur API prospects assignés:', error);
      return [];
    }
  },

  async create(prospect: ProspectData) {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .insert([prospect])
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la création du prospect:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Erreur création prospect:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<ProspectData>) {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la mise à jour du prospect:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Erreur mise à jour prospect:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('prospects')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erreur lors de la suppression du prospect:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erreur suppression prospect:', error);
      throw error;
    }
  }
};
