export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["chat_role"]
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["chat_role"]
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["chat_role"]
          user_id?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          diary_id: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          diary_id: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          diary_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "diaries"
            referencedColumns: ["id"]
          },
        ]
      }
      diaries: {
        Row: {
          content: string
          created_at: string
          diary_image: string | null
          emotion_main_id: number
          id: string
          is_drafted: boolean
          is_public: boolean
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          diary_image?: string | null
          emotion_main_id: number
          id?: string
          is_drafted?: boolean
          is_public: boolean
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          diary_image?: string | null
          emotion_main_id?: number
          id?: string
          is_drafted?: boolean
          is_public?: boolean
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diaries_emotion_main_id_fkey"
            columns: ["emotion_main_id"]
            isOneToOne: false
            referencedRelation: "emotion_mains"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_analysis: {
        Row: {
          created_at: string | null
          diary_id: string
          id: string
          is_quest_accepted: boolean
          reason_text: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          diary_id: string
          id?: string
          is_quest_accepted?: boolean
          reason_text?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          diary_id?: string
          id?: string
          is_quest_accepted?: boolean
          reason_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diary_analysis_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "diaries"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_hashtags: {
        Row: {
          diary_id: string
          hashtag_id: string
        }
        Insert: {
          diary_id: string
          hashtag_id: string
        }
        Update: {
          diary_id?: string
          hashtag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diary_hashtags_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "diaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diary_hashtags_hashtag_id_fkey"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "hashtags"
            referencedColumns: ["id"]
          },
        ]
      }
      emotion_mains: {
        Row: {
          icon_url: string
          id: number
          name: string
        }
        Insert: {
          icon_url: string
          id?: number
          name: string
        }
        Update: {
          icon_url?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      emotion_subs: {
        Row: {
          emotion_main_id: number
          id: number
          name: string
        }
        Insert: {
          emotion_main_id: number
          id?: number
          name: string
        }
        Update: {
          emotion_main_id?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotion_subs_emotion_main_id_fkey"
            columns: ["emotion_main_id"]
            isOneToOne: false
            referencedRelation: "emotion_mains"
            referencedColumns: ["id"]
          },
        ]
      }
      hashtags: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          diary_id: string
          id: string
          user_id: string
        }
        Insert: {
          diary_id: string
          id?: string
          user_id: string
        }
        Update: {
          diary_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "diaries"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          diary_id: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          diary_id: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          diary_id?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_diary_id_fkey"
            columns: ["diary_id"]
            isOneToOne: false
            referencedRelation: "diaries"
            referencedColumns: ["id"]
          },
        ]
      }
      quests: {
        Row: {
          content: string
          emotion_main_id: number
          id: number
          title: string
        }
        Insert: {
          content: string
          emotion_main_id: number
          id?: number
          title: string
        }
        Update: {
          content?: string
          emotion_main_id?: number
          id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quests_emotion_main_id_fkey"
            columns: ["emotion_main_id"]
            isOneToOne: false
            referencedRelation: "emotion_mains"
            referencedColumns: ["id"]
          },
        ]
      }
      user_accepted_quests: {
        Row: {
          accepted_at: string
          diary_analysis_id: string
          is_completed: boolean
          quest_id: number
          user_id: string
        }
        Insert: {
          accepted_at?: string
          diary_analysis_id: string
          is_completed?: boolean
          quest_id: number
          user_id: string
        }
        Update: {
          accepted_at?: string
          diary_analysis_id?: string
          is_completed?: boolean
          quest_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_diary_analysis"
            columns: ["diary_analysis_id"]
            isOneToOne: false
            referencedRelation: "diary_analysis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_accepted_quests_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_selected_emotions: {
        Row: {
          diary_analysis_id: string
          emotion_id: number
        }
        Insert: {
          diary_analysis_id: string
          emotion_id: number
        }
        Update: {
          diary_analysis_id?: string
          emotion_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_diary_analysis"
            columns: ["diary_analysis_id"]
            isOneToOne: false
            referencedRelation: "diary_analysis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_selected_emotions_emotion_id_fkey"
            columns: ["emotion_id"]
            isOneToOne: false
            referencedRelation: "emotion_subs"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          profile_image: string | null
        }
        Insert: {
          created_at?: string
          email?: string
          id: string
          name: string
          profile_image?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          profile_image?: string | null
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
      chat_role: "user" | "model"
      notification_type: "ai" | "좋아요" | "댓글"
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
    Enums: {
      chat_role: ["user", "model"],
      notification_type: ["ai", "좋아요", "댓글"],
    },
  },
} as const