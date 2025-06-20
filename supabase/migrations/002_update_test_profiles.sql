
-- Mettre à jour les profils avec les vrais noms
UPDATE public.profiles 
SET first_name = 'Hamdi', last_name = 'Mekni'
WHERE id = '550e8400-e29b-41d4-a716-446655440000' AND role = 'admin';

UPDATE public.profiles 
SET first_name = 'Snoussi', last_name = 'Zouhair'
WHERE id = '550e8400-e29b-41d4-a716-446655440002' AND role = 'commercial';

UPDATE public.profiles 
SET first_name = 'Dahmani', last_name = 'Mouna'
WHERE id = '550e8400-e29b-41d4-a716-446655440003' AND role = 'commercial';

-- Ajouter le profil de Maatoug Radhia
INSERT INTO public.profiles (id, email, first_name, last_name, role, phone) VALUES
  ('550e8400-e29b-41d4-a716-446655440004', 'commercial3@premunia.fr', 'Maatoug', 'Radhia', 'commercial', '01.67.89.01.23')
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone;

-- Mettre à jour les données de prospects pour les assigner aux nouveaux commerciaux
UPDATE public.prospects 
SET assigned_to = '550e8400-e29b-41d4-a716-446655440004'
WHERE id = '660e8400-e29b-41d4-a716-446655440004';

-- Mettre à jour les clients pour les assigner aux nouveaux commerciaux
UPDATE public.clients 
SET assigned_to = '550e8400-e29b-41d4-a716-446655440004'
WHERE id = '770e8400-e29b-41d4-a716-446655440002';

-- Ajouter des objectifs pour Maatoug Radhia
INSERT INTO public.commercial_objectives (id, commercial_id, periode_type, periode_valeur, objectif_ca, objectif_prospects, objectif_conversions, objectif_rdv, ca_realise, prospects_realises, conversions_realisees, rdv_realises, created_by) VALUES
  ('dd0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'mensuel', '2024-12', 40000, 20, 6, 15, 32000, 18, 4, 13, '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO UPDATE SET
  commercial_id = EXCLUDED.commercial_id,
  objectif_ca = EXCLUDED.objectif_ca,
  objectif_prospects = EXCLUDED.objectif_prospects,
  objectif_conversions = EXCLUDED.objectif_conversions,
  objectif_rdv = EXCLUDED.objectif_rdv,
  ca_realise = EXCLUDED.ca_realise,
  prospects_realises = EXCLUDED.prospects_realises,
  conversions_realisees = EXCLUDED.conversions_realisees,
  rdv_realises = EXCLUDED.rdv_realises;

-- Ajouter des statistiques de performance pour Maatoug Radhia
INSERT INTO public.performance_stats (id, commercial_id, date_stat, prospects_nouveaux, prospects_convertis, ca_genere, appels_effectues, emails_envoyes, rdv_planifies, rdv_honores) VALUES
  ('ee0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '2024-12-20', 3, 1, 3200, 7, 4, 2, 2)
ON CONFLICT (id) DO UPDATE SET
  commercial_id = EXCLUDED.commercial_id,
  prospects_nouveaux = EXCLUDED.prospects_nouveaux,
  prospects_convertis = EXCLUDED.prospects_convertis,
  ca_genere = EXCLUDED.ca_genere,
  appels_effectues = EXCLUDED.appels_effectues,
  emails_envoyes = EXCLUDED.emails_envoyes,
  rdv_planifies = EXCLUDED.rdv_planifies,
  rdv_honores = EXCLUDED.rdv_honores;
