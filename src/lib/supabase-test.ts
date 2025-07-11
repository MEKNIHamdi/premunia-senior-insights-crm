
// Test de connexion Supabase
import { supabase } from '@/integrations/supabase/client';

export async function testSupabaseConnection() {
  try {
    console.log('🔄 Test de connexion à Supabase...');
    
    // Test de connexion basique
    const { data, error } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('❌ Erreur de connexion:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Connexion Supabase réussie');
    return { success: true, data };
  } catch (err) {
    console.error('❌ Erreur de test:', err);
    return { success: false, error: err.message };
  }
}

export async function createTestProfile() {
  try {
    console.log('🔄 Création d\'un profil de test...');
    
    // Générer un UUID valide pour le profil de test
    const testUuid = crypto.randomUUID();
    
    const testProfile = {
      id: testUuid,
      email: 'admin@premunia.fr',
      first_name: 'Jean',
      last_name: 'Dupont',
      role: 'admin'
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert([testProfile])
      .select();
    
    if (error) {
      console.error('❌ Erreur création profil:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Profil de test créé:', data);
    return { success: true, data };
  } catch (err) {
    console.error('❌ Erreur:', err);
    return { success: false, error: err.message };
  }
}

export async function createTestData() {
  try {
    console.log('🔄 Création de données de test...');
    
    // D'abord créer un profil de test valide
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'admin@premunia.fr')
      .maybeSingle();
    
    let assignedToId;
    if (profileError || !profileData) {
      // Créer le profil s'il n'existe pas
      const profileResult = await createTestProfile();
      if (!profileResult.success) {
        return profileResult;
      }
      assignedToId = profileResult.data[0].id;
    } else {
      assignedToId = profileData.id;
    }
    
    // Créer des prospects de test
    const testProspects = [
      {
        first_name: 'Marie',
        last_name: 'Martin',
        email: 'marie.martin@email.com',
        phone: '01.23.45.67.89',
        status: 'qualified',
        priority: 'high',
        expected_revenue: 2500,
        interest_type: 'health_insurance',
        assigned_to: assignedToId
      },
      {
        first_name: 'Paul',
        last_name: 'Bernard',
        email: 'paul.bernard@email.com',
        phone: '01.34.56.78.90',
        status: 'interested',
        priority: 'medium',
        expected_revenue: 1800,
        interest_type: 'health_insurance',
        assigned_to: assignedToId
      }
    ];
    
    const { data: prospects, error: prospectsError } = await supabase
      .from('prospects')
      .upsert(testProspects)
      .select();
    
    if (prospectsError) {
      console.error('❌ Erreur création prospects:', prospectsError);
      return { success: false, error: prospectsError.message };
    }
    
    console.log('✅ Prospects de test créés:', prospects);
    
    // Créer des objectifs commerciaux de test
    const currentMonth = new Date().toISOString().slice(0, 7);
    const testObjective = {
      commercial_id: assignedToId,
      periode_type: 'mensuel',
      periode_valeur: currentMonth,
      objectif_ca: 50000,
      objectif_prospects: 100,
      objectif_conversions: 15,
      objectif_rdv: 25,
      ca_realise: 32000,
      prospects_realises: 67,
      conversions_realisees: 8,
      rdv_realises: 18
    };
    
    const { data: objective, error: objectiveError } = await supabase
      .from('commercial_objectives')
      .upsert([testObjective])
      .select();
    
    if (objectiveError) {
      console.error('❌ Erreur création objectif:', objectiveError);
    } else {
      console.log('✅ Objectif de test créé:', objective);
    }
    
    return { success: true, prospects, objective };
  } catch (err) {
    console.error('❌ Erreur:', err);
    return { success: false, error: err.message };
  }
}
