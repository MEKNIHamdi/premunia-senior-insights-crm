export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          claim_id: string | null
          client_id: string | null
          completed_date: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          policy_id: string | null
          priority: string | null
          prospect_id: string | null
          scheduled_date: string | null
          status: string | null
          title: string
          type: string
        }
        Insert: {
          claim_id?: string | null
          client_id?: string | null
          completed_date?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          policy_id?: string | null
          priority?: string | null
          prospect_id?: string | null
          scheduled_date?: string | null
          status?: string | null
          title: string
          type: string
        }
        Update: {
          claim_id?: string | null
          client_id?: string | null
          completed_date?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          policy_id?: string | null
          priority?: string | null
          prospect_id?: string | null
          scheduled_date?: string | null
          status?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_type: string | null
          assigned_to: string
          client_id: string | null
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          location: string | null
          notes: string | null
          prospect_id: string | null
          reminder_sent: boolean | null
          start_time: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          appointment_type?: string | null
          assigned_to: string
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          notes?: string | null
          prospect_id?: string | null
          reminder_sent?: boolean | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          appointment_type?: string | null
          assigned_to?: string
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          notes?: string | null
          prospect_id?: string | null
          reminder_sent?: boolean | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_executions: {
        Row: {
          client_id: string | null
          created_at: string | null
          date_execution: string | null
          date_programmee: string | null
          erreur: string | null
          id: string
          prospect_id: string | null
          resultat: Json | null
          scenario_id: string | null
          statut: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          date_execution?: string | null
          date_programmee?: string | null
          erreur?: string | null
          id?: string
          prospect_id?: string | null
          resultat?: Json | null
          scenario_id?: string | null
          statut?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          date_execution?: string | null
          date_programmee?: string | null
          erreur?: string | null
          id?: string
          prospect_id?: string | null
          resultat?: Json | null
          scenario_id?: string | null
          statut?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_executions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_executions_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_executions_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "automation_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_scenarios: {
        Row: {
          actions: Json | null
          conditions: Json | null
          created_at: string | null
          created_by: string | null
          delai_minutes: number | null
          description: string | null
          id: string
          nom: string
          statut: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          actions?: Json | null
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          delai_minutes?: number | null
          description?: string | null
          id?: string
          nom: string
          statut?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json | null
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          delai_minutes?: number | null
          description?: string | null
          id?: string
          nom?: string
          statut?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_scenarios_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          assigned_to: string | null
          claim_number: string
          claim_type: string
          client_id: string | null
          created_at: string | null
          description: string
          estimated_amount: number | null
          id: string
          incident_date: string
          insurer_claim_number: string | null
          notes: string | null
          policy_id: string | null
          reported_date: string | null
          settled_amount: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          claim_number: string
          claim_type: string
          client_id?: string | null
          created_at?: string | null
          description: string
          estimated_amount?: number | null
          id?: string
          incident_date: string
          insurer_claim_number?: string | null
          notes?: string | null
          policy_id?: string | null
          reported_date?: string | null
          settled_amount?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          claim_number?: string
          claim_type?: string
          client_id?: string | null
          created_at?: string | null
          description?: string
          estimated_amount?: number | null
          id?: string
          incident_date?: string
          insurer_claim_number?: string | null
          notes?: string | null
          policy_id?: string | null
          reported_date?: string | null
          settled_amount?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claims_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          acquisition_date: string | null
          address: string | null
          assigned_to: string | null
          birth_date: string | null
          city: string | null
          client_number: string
          country: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          marital_status: string | null
          notes: string | null
          phone: string | null
          postal_code: string | null
          profession: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          acquisition_date?: string | null
          address?: string | null
          assigned_to?: string | null
          birth_date?: string | null
          city?: string | null
          client_number: string
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          marital_status?: string | null
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          profession?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          acquisition_date?: string | null
          address?: string | null
          assigned_to?: string | null
          birth_date?: string | null
          city?: string | null
          client_number?: string
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          marital_status?: string | null
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          profession?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commercial_objectives: {
        Row: {
          ca_realise: number | null
          commercial_id: string | null
          conversions_realisees: number | null
          created_at: string | null
          created_by: string | null
          id: string
          objectif_ca: number | null
          objectif_conversions: number | null
          objectif_prospects: number | null
          objectif_rdv: number | null
          periode_type: string
          periode_valeur: string
          prospects_realises: number | null
          rdv_realises: number | null
          updated_at: string | null
        }
        Insert: {
          ca_realise?: number | null
          commercial_id?: string | null
          conversions_realisees?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          objectif_ca?: number | null
          objectif_conversions?: number | null
          objectif_prospects?: number | null
          objectif_rdv?: number | null
          periode_type: string
          periode_valeur: string
          prospects_realises?: number | null
          rdv_realises?: number | null
          updated_at?: string | null
        }
        Update: {
          ca_realise?: number | null
          commercial_id?: string | null
          conversions_realisees?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          objectif_ca?: number | null
          objectif_conversions?: number | null
          objectif_prospects?: number | null
          objectif_rdv?: number | null
          periode_type?: string
          periode_valeur?: string
          prospects_realises?: number | null
          rdv_realises?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commercial_objectives_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commercial_objectives_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string | null
          claim_id: string | null
          client_id: string | null
          created_at: string | null
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          is_confidential: boolean | null
          name: string
          policy_id: string | null
          uploaded_by: string
        }
        Insert: {
          category?: string | null
          claim_id?: string | null
          client_id?: string | null
          created_at?: string | null
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          is_confidential?: boolean | null
          name: string
          policy_id?: string | null
          uploaded_by: string
        }
        Update: {
          category?: string | null
          claim_id?: string | null
          client_id?: string | null
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          is_confidential?: boolean | null
          name?: string
          policy_id?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          contenu_html: string
          contenu_text: string | null
          created_at: string | null
          created_by: string | null
          id: string
          nom: string
          sujet: string
          type: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          contenu_html: string
          contenu_text?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          nom: string
          sujet: string
          type: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          contenu_html?: string
          contenu_text?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          nom?: string
          sujet?: string
          type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_events: {
        Row: {
          client_id: string | null
          commercial_id: string | null
          date_evenement: string | null
          donnees_evenement: Json | null
          id: string
          prospect_id: string | null
          scenario_id: string | null
          type_evenement: string
        }
        Insert: {
          client_id?: string | null
          commercial_id?: string | null
          date_evenement?: string | null
          donnees_evenement?: Json | null
          id?: string
          prospect_id?: string | null
          scenario_id?: string | null
          type_evenement: string
        }
        Update: {
          client_id?: string | null
          commercial_id?: string | null
          date_evenement?: string | null
          donnees_evenement?: Json | null
          id?: string
          prospect_id?: string | null
          scenario_id?: string | null
          type_evenement?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_events_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_events_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_events_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "automation_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_stats: {
        Row: {
          appels_effectues: number | null
          ca_genere: number | null
          commercial_id: string | null
          created_at: string | null
          date_stat: string
          emails_envoyes: number | null
          id: string
          prospects_convertis: number | null
          prospects_nouveaux: number | null
          rdv_honores: number | null
          rdv_planifies: number | null
          taux_conversion: number | null
        }
        Insert: {
          appels_effectues?: number | null
          ca_genere?: number | null
          commercial_id?: string | null
          created_at?: string | null
          date_stat: string
          emails_envoyes?: number | null
          id?: string
          prospects_convertis?: number | null
          prospects_nouveaux?: number | null
          rdv_honores?: number | null
          rdv_planifies?: number | null
          taux_conversion?: number | null
        }
        Update: {
          appels_effectues?: number | null
          ca_genere?: number | null
          commercial_id?: string | null
          created_at?: string | null
          date_stat?: string
          emails_envoyes?: number | null
          id?: string
          prospects_convertis?: number | null
          prospects_nouveaux?: number | null
          rdv_honores?: number | null
          rdv_planifies?: number | null
          taux_conversion?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_stats_commercial_id_fkey"
            columns: ["commercial_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      policies: {
        Row: {
          client_id: string | null
          commission_amount: number | null
          commission_rate: number | null
          coverage_type: string | null
          created_at: string | null
          documents_complete: boolean | null
          end_date: string
          id: string
          insurer: string
          notes: string | null
          payment_frequency: string | null
          policy_number: string
          premium_amount: number
          product_type: string
          renewal_date: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          commission_amount?: number | null
          commission_rate?: number | null
          coverage_type?: string | null
          created_at?: string | null
          documents_complete?: boolean | null
          end_date: string
          id?: string
          insurer: string
          notes?: string | null
          payment_frequency?: string | null
          policy_number: string
          premium_amount: number
          product_type: string
          renewal_date?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          commission_amount?: number | null
          commission_rate?: number | null
          coverage_type?: string | null
          created_at?: string | null
          documents_complete?: boolean | null
          end_date?: string
          id?: string
          insurer?: string
          notes?: string | null
          payment_frequency?: string | null
          policy_number?: string
          premium_amount?: number
          product_type?: string
          renewal_date?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "policies_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      prospects: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          email: string | null
          expected_revenue: number | null
          first_name: string
          id: string
          interest_type: string | null
          last_contact_date: string | null
          last_name: string
          next_contact_date: string | null
          notes: string | null
          phone: string | null
          priority: string | null
          source: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          email?: string | null
          expected_revenue?: number | null
          first_name: string
          id?: string
          interest_type?: string | null
          last_contact_date?: string | null
          last_name: string
          next_contact_date?: string | null
          notes?: string | null
          phone?: string | null
          priority?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          email?: string | null
          expected_revenue?: number | null
          first_name?: string
          id?: string
          interest_type?: string | null
          last_contact_date?: string | null
          last_name?: string
          next_contact_date?: string | null
          notes?: string | null
          phone?: string | null
          priority?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prospects_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name: string
          id: string
          last_name: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
