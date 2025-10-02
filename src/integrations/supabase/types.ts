export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_icon: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          badge_icon?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          badge_icon?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      agent_conversations: {
        Row: {
          agent_type: string
          context_summary: string | null
          created_at: string | null
          embedding: string | null
          id: string
          messages: Json[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_type: string
          context_summary?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          messages?: Json[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_type?: string
          context_summary?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          messages?: Json[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      career_insights: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          data_sources: string[] | null
          id: string
          insight_type: string
          prediction: Json
          user_id: string
          valid_until: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          data_sources?: string[] | null
          id?: string
          insight_type: string
          prediction: Json
          user_id: string
          valid_until?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          data_sources?: string[] | null
          id?: string
          insight_type?: string
          prediction?: Json
          user_id?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      connections: {
        Row: {
          created_at: string
          id: string
          recipient_id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipient_id: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          recipient_id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_flags: {
        Row: {
          content_id: string | null
          content_type: string | null
          created_at: string | null
          flagged_by: string | null
          id: string
          reason: string | null
          status: string | null
        }
        Insert: {
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          flagged_by?: string | null
          id?: string
          reason?: string | null
          status?: string | null
        }
        Update: {
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          flagged_by?: string | null
          id?: string
          reason?: string | null
          status?: string | null
        }
        Relationships: []
      }
      content_language: {
        Row: {
          content_id: string | null
          content_type: string | null
          created_at: string | null
          id: string
          language_code: string | null
        }
        Insert: {
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          language_code?: string | null
        }
        Update: {
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          language_code?: string | null
        }
        Relationships: []
      }
      content_tag_mappings: {
        Row: {
          content_id: string | null
          content_type: string | null
          id: string
          tag_id: string | null
        }
        Insert: {
          content_id?: string | null
          content_type?: string | null
          id?: string
          tag_id?: string | null
        }
        Update: {
          content_id?: string | null
          content_type?: string | null
          id?: string
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_tag_mappings_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "content_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      content_tags: {
        Row: {
          created_at: string | null
          id: string
          tag: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          tag: string
        }
        Update: {
          created_at?: string | null
          id?: string
          tag?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string | null
          id: string
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_group: boolean | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_group?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_group?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          content: string
          content_type: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          source_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          content_type: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          source_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          source_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      matching_results: {
        Row: {
          compatibility: string | null
          created_at: string
          id: string
          match_score: number | null
          matched_user_id: string
          recommended_reason: string | null
          user_id: string
        }
        Insert: {
          compatibility?: string | null
          created_at?: string
          id?: string
          match_score?: number | null
          matched_user_id: string
          recommended_reason?: string | null
          user_id: string
        }
        Update: {
          compatibility?: string | null
          created_at?: string
          id?: string
          match_score?: number | null
          matched_user_id?: string
          recommended_reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      message_status: {
        Row: {
          id: string
          message_id: string | null
          status: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          message_id?: string | null
          status?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          message_id?: string | null
          status?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_status_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string | null
          created_at: string | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          is_deleted: boolean | null
          is_edited: boolean | null
          message_type: string | null
          reply_to_id: string | null
          sender_id: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          message_type?: string | null
          reply_to_id?: string | null
          sender_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_deleted?: boolean | null
          is_edited?: boolean | null
          message_type?: string | null
          reply_to_id?: string | null
          sender_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          enable_email: boolean | null
          enable_push: boolean | null
          enable_sms: boolean | null
          id: string
          user_id: string
          weekly_digest: boolean | null
        }
        Insert: {
          created_at?: string | null
          enable_email?: boolean | null
          enable_push?: boolean | null
          enable_sms?: boolean | null
          id?: string
          user_id: string
          weekly_digest?: boolean | null
        }
        Update: {
          created_at?: string | null
          enable_email?: boolean | null
          enable_push?: boolean | null
          enable_sms?: boolean | null
          id?: string
          user_id?: string
          weekly_digest?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_online: boolean | null
          last_seen: string | null
          phone: string | null
          status: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_online?: boolean | null
          last_seen?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_online?: boolean | null
          last_seen?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          obtained_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          obtained_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          obtained_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_knowledge_graph: {
        Row: {
          compatibility_score: number | null
          connected_user_id: string
          created_at: string | null
          id: string
          interaction_count: number | null
          last_interaction: string | null
          metadata: Json | null
          relationship_type: string
          shared_interests: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          compatibility_score?: number | null
          connected_user_id: string
          created_at?: string | null
          id?: string
          interaction_count?: number | null
          last_interaction?: string | null
          metadata?: Json | null
          relationship_type: string
          shared_interests?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          compatibility_score?: number | null
          connected_user_id?: string
          created_at?: string | null
          id?: string
          interaction_count?: number | null
          last_interaction?: string | null
          metadata?: Json | null
          relationship_type?: string
          shared_interests?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_points: {
        Row: {
          id: string
          points: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          points?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          points?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      video_sessions: {
        Row: {
          ended_at: string | null
          id: string
          mentorship_session_id: string | null
          recording_url: string | null
          screen_share_used: boolean | null
          started_at: string | null
        }
        Insert: {
          ended_at?: string | null
          id?: string
          mentorship_session_id?: string | null
          recording_url?: string | null
          screen_share_used?: boolean | null
          started_at?: string | null
        }
        Update: {
          ended_at?: string | null
          id?: string
          mentorship_session_id?: string | null
          recording_url?: string | null
          screen_share_used?: boolean | null
          started_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_user_connections: {
        Args: { user_uuid: string }
        Returns: {
          avatar_url: string
          connected_user_id: string
          connection_id: string
          full_name: string
          is_online: boolean
          status: string
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      update_user_online_status: {
        Args: { is_online: boolean; user_id: string }
        Returns: undefined
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
