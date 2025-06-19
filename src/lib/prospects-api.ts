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
    const { data, error } = await supabase
      .from('prospects')
      .select(`
        *,
        assigned_to_profile:profiles!prospects_assigned_to_fkey(first_name, last_name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getByAssignee(assigneeId: string) {
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .eq('assigned_to', assigneeId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(prospect: ProspectData) {
    const { data, error } = await supabase
      .from('prospects')
      .insert([prospect])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<ProspectData>) {
    const { data, error } = await supabase
      .from('prospects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('prospects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};