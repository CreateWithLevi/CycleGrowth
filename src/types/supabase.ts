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
      growth_activities: {
        Row: {
          action: string
          created_at: string | null
          id: string
          item: string
          system_id: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          item: string
          system_id?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          item?: string
          system_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "growth_activities_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "growth_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      growth_systems: {
        Row: {
          created_at: string | null
          current_phase: string
          description: string | null
          domain: string
          id: string
          progress: number
          start_date: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_phase?: string
          description?: string | null
          domain: string
          id?: string
          progress?: number
          start_date?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_phase?: string
          description?: string | null
          domain?: string
          id?: string
          progress?: number
          start_date?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      growth_tasks: {
        Row: {
          created_at: string | null
          cycle_phase: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          status: string
          system_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cycle_phase?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          system_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cycle_phase?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          system_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "growth_tasks_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "growth_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_connections: {
        Row: {
          created_at: string | null
          id: string
          source_id: string
          target_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          source_id: string
          target_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          source_id?: string
          target_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_connections_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "knowledge_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_connections_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "knowledge_items"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_items: {
        Row: {
          content: string
          created_at: string | null
          id: string
          source: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          source?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          source?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_tags: {
        Row: {
          created_at: string | null
          id: string
          knowledge_id: string
          tag: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          knowledge_id: string
          tag: string
        }
        Update: {
          created_at?: string | null
          id?: string
          knowledge_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_tags_knowledge_id_fkey"
            columns: ["knowledge_id"]
            isOneToOne: false
            referencedRelation: "knowledge_items"
            referencedColumns: ["id"]
          },
        ]
      }
      reflection_insights: {
        Row: {
          content: string
          created_at: string | null
          id: string
          reflection_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          reflection_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          reflection_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reflection_insights_reflection_id_fkey"
            columns: ["reflection_id"]
            isOneToOne: false
            referencedRelation: "reflections"
            referencedColumns: ["id"]
          },
        ]
      }
      reflection_tags: {
        Row: {
          created_at: string | null
          id: string
          reflection_id: string
          tag: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reflection_id: string
          tag: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reflection_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "reflection_tags_reflection_id_fkey"
            columns: ["reflection_id"]
            isOneToOne: false
            referencedRelation: "reflections"
            referencedColumns: ["id"]
          },
        ]
      }
      reflections: {
        Row: {
          content: string
          created_at: string | null
          cycle_phase: string
          domain: string
          id: string
          system_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          cycle_phase: string
          domain: string
          id?: string
          system_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          cycle_phase?: string
          domain?: string
          id?: string
          system_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reflections_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "growth_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reflections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number | null
          cancel_at_period_end: boolean | null
          canceled_at: number | null
          created_at: string
          currency: string | null
          current_period_end: number | null
          current_period_start: number | null
          custom_field_data: Json | null
          customer_cancellation_comment: string | null
          customer_cancellation_reason: string | null
          customer_id: string | null
          ended_at: number | null
          ends_at: number | null
          id: string
          interval: string | null
          metadata: Json | null
          price_id: string | null
          started_at: number | null
          status: string | null
          stripe_id: string | null
          stripe_price_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          cancel_at_period_end?: boolean | null
          canceled_at?: number | null
          created_at?: string
          currency?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          custom_field_data?: Json | null
          customer_cancellation_comment?: string | null
          customer_cancellation_reason?: string | null
          customer_id?: string | null
          ended_at?: number | null
          ends_at?: number | null
          id?: string
          interval?: string | null
          metadata?: Json | null
          price_id?: string | null
          started_at?: number | null
          status?: string | null
          stripe_id?: string | null
          stripe_price_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          cancel_at_period_end?: boolean | null
          canceled_at?: number | null
          created_at?: string
          currency?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          custom_field_data?: Json | null
          customer_cancellation_comment?: string | null
          customer_cancellation_reason?: string | null
          customer_id?: string | null
          ended_at?: number | null
          ends_at?: number | null
          id?: string
          interval?: string | null
          metadata?: Json | null
          price_id?: string | null
          started_at?: number | null
          status?: string | null
          stripe_id?: string | null
          stripe_price_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      task_tags: {
        Row: {
          created_at: string | null
          id: string
          tag: string
          task_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          tag: string
          task_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          tag?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_tags_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "growth_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cyclo_evolution: {
        Row: {
          created_at: string | null
          current_stage: number
          id: string
          interactions_count: number
          knowledge_items_created: number | null
          last_interaction: string | null
          reflections_created: number | null
          systems_created: number | null
          tasks_completed: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_stage?: number
          id?: string
          interactions_count?: number
          knowledge_items_created?: number | null
          last_interaction?: string | null
          reflections_created?: number | null
          systems_created?: number | null
          tasks_completed?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_stage?: number
          id?: string
          interactions_count?: number
          knowledge_items_created?: number | null
          last_interaction?: string | null
          reflections_created?: number | null
          systems_created?: number | null
          tasks_completed?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          credits: string | null
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          subscription: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          subscription?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          credits?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          subscription?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          data: Json | null
          event_type: string
          id: string
          modified_at: string
          stripe_event_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          event_type: string
          id?: string
          modified_at?: string
          stripe_event_id?: string | null
          type: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          event_type?: string
          id?: string
          modified_at?: string
          stripe_event_id?: string | null
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_table_rls_status: {
        Args: {
          table_name: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
