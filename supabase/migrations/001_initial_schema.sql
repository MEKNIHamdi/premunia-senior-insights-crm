
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    role VARCHAR CHECK (role IN ('admin', 'manager', 'commercial')) NOT NULL,
    avatar VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prospects table
CREATE TABLE public.prospects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom VARCHAR NOT NULL,
    prenom VARCHAR,
    email VARCHAR,
    telephone VARCHAR,
    date_naissance DATE,
    age INTEGER,
    statut VARCHAR CHECK (statut IN ('nouveau', 'qualifie', 'interesse', 'negocie', 'signe', 'perdu')) DEFAULT 'nouveau',
    score INTEGER DEFAULT 0,
    budget_max DECIMAL(10,2),
    type_contrat VARCHAR CHECK (type_contrat IN ('individuel', 'couple', 'famille')) DEFAULT 'individuel',
    commercial_id UUID REFERENCES public.profiles(id),
    notes TEXT,
    source VARCHAR, -- 'excel', 'googlesheet', 'hubspot', 'manuel'
    source_id VARCHAR, -- ID externe pour synchronisation
    adresse TEXT,
    ville VARCHAR,
    code_postal VARCHAR,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    derniere_activite TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opportunities table
CREATE TABLE public.opportunities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom VARCHAR NOT NULL,
    prospect_id UUID REFERENCES public.prospects(id) ON DELETE CASCADE,
    valeur DECIMAL(10,2) NOT NULL,
    statut VARCHAR CHECK (statut IN ('nouveau', 'en_cours', 'gagne', 'perdu')) DEFAULT 'nouveau',
    probabilite INTEGER DEFAULT 50,
    date_cloture_prevue DATE,
    commercial_id UUID REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titre VARCHAR NOT NULL,
    description TEXT,
    statut VARCHAR CHECK (statut IN ('en_attente', 'en_cours', 'terminee', 'annulee')) DEFAULT 'en_attente',
    priorite VARCHAR CHECK (priorite IN ('basse', 'moyenne', 'haute', 'urgente')) DEFAULT 'moyenne',
    date_echeance TIMESTAMP WITH TIME ZONE,
    assignee_id UUID REFERENCES public.profiles(id),
    prospect_id UUID REFERENCES public.prospects(id),
    opportunity_id UUID REFERENCES public.opportunities(id),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE public.appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titre VARCHAR NOT NULL,
    description TEXT,
    date_debut TIMESTAMP WITH TIME ZONE NOT NULL,
    date_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    lieu VARCHAR,
    type_rdv VARCHAR CHECK (type_rdv IN ('appel', 'visio', 'presentiel', 'autre')) DEFAULT 'appel',
    statut VARCHAR CHECK (statut IN ('planifie', 'confirme', 'annule', 'reporte', 'termine')) DEFAULT 'planifie',
    commercial_id UUID REFERENCES public.profiles(id),
    prospect_id UUID REFERENCES public.prospects(id),
    opportunity_id UUID REFERENCES public.opportunities(id),
    rappel_minutes INTEGER DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE public.documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom VARCHAR NOT NULL,
    type VARCHAR, -- 'excel', 'pdf', 'word', etc.
    taille_bytes BIGINT,
    url VARCHAR NOT NULL,
    prospect_id UUID REFERENCES public.prospects(id),
    opportunity_id UUID REFERENCES public.opportunities(id),
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE public.campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom VARCHAR NOT NULL,
    type VARCHAR CHECK (type IN ('email', 'sms', 'appel')) NOT NULL,
    statut VARCHAR CHECK (statut IN ('planifiee', 'en_cours', 'terminee', 'suspendue')) DEFAULT 'planifiee',
    date_lancement TIMESTAMP WITH TIME ZONE,
    date_fin TIMESTAMP WITH TIME ZONE,
    nb_envoyes INTEGER DEFAULT 0,
    taux_ouverture DECIMAL(5,2),
    nb_conversions INTEGER DEFAULT 0,
    contenu TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sync logs table for external integrations
CREATE TABLE public.sync_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    source VARCHAR NOT NULL, -- 'googlesheet', 'hubspot', 'excel'
    statut VARCHAR CHECK (statut IN ('succes', 'erreur', 'en_cours')) NOT NULL,
    nb_records INTEGER DEFAULT 0,
    message TEXT,
    details JSONB,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Prospects policies
CREATE POLICY "Admins can view all prospects" ON public.prospects FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Managers can view all prospects" ON public.prospects FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);
CREATE POLICY "Commercials can view their prospects" ON public.prospects FOR SELECT USING (
    commercial_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Similar policies for other tables...
CREATE POLICY "Users can manage based on role" ON public.opportunities FOR ALL USING (
    commercial_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

CREATE POLICY "Users can manage based on role" ON public.tasks FOR ALL USING (
    assignee_id = auth.uid() OR created_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

CREATE POLICY "Users can manage based on role" ON public.appointments FOR ALL USING (
    commercial_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Indexes for performance
CREATE INDEX idx_prospects_commercial ON public.prospects(commercial_id);
CREATE INDEX idx_prospects_statut ON public.prospects(statut);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX idx_tasks_echeance ON public.tasks(date_echeance);
CREATE INDEX idx_appointments_commercial ON public.appointments(commercial_id);
CREATE INDEX idx_appointments_date ON public.appointments(date_debut);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prospects_updated_at BEFORE UPDATE ON public.prospects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
