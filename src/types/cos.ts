export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      artifact_audiences: {
        Row: {
          artifact_id: string
          audience_id: string
          granted_at: string
          granted_by: string | null
        }
        Insert: {
          artifact_id: string
          audience_id: string
          granted_at?: string
          granted_by?: string | null
        }
        Update: {
          artifact_id?: string
          audience_id?: string
          granted_at?: string
          granted_by?: string | null
        }
        Relationships: []
      }
      audience_master: {
        Row: {
          access_level: string
          contacts: Json
          created_at: string
          description: string | null
          id: string
          metadata: Json
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          access_level?: string
          contacts?: Json
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          access_level?: string
          contacts?: Json
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      cos_admins: {
        Row: {
          added_at: string
          added_by: string | null
          email: string
          is_active: boolean
          note: string | null
        }
        Insert: {
          added_at?: string
          added_by?: string | null
          email: string
          is_active?: boolean
          note?: string | null
        }
        Update: {
          added_at?: string
          added_by?: string | null
          email?: string
          is_active?: boolean
          note?: string | null
        }
        Relationships: []
      }
      marketing_master: {
        Row: {
          author: string | null
          content: string | null
          content_url: string | null
          created_at: string
          description: string | null
          explains: string[]
          id: string
          kind: string
          metadata: Json
          slug: string
          status: string
          storage_path: string | null
          title: string
          updated_at: string
          version: number
          vertical: string | null
        }
        Insert: {
          author?: string | null
          content?: string | null
          content_url?: string | null
          created_at?: string
          description?: string | null
          explains?: string[]
          id?: string
          kind: string
          metadata?: Json
          slug: string
          status?: string
          storage_path?: string | null
          title: string
          updated_at?: string
          version?: number
          vertical?: string | null
        }
        Update: {
          author?: string | null
          content?: string | null
          content_url?: string | null
          created_at?: string
          description?: string | null
          explains?: string[]
          id?: string
          kind?: string
          metadata?: Json
          slug?: string
          status?: string
          storage_path?: string | null
          title?: string
          updated_at?: string
          version?: number
          vertical?: string | null
        }
        Relationships: []
      }
      systems_operations: {
        Row: {
          artifact_class: string
          author: string | null
          content: string | null
          content_url: string | null
          created_at: string
          description: string | null
          id: string
          is_canonical: boolean
          kind: string
          metadata: Json
          pattern_key: string | null
          principle_anchors: number[] | null
          slug: string
          source_session: string | null
          status: string
          storage_path: string | null
          superseded_by_slug: string | null
          surfaces: string[]
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          artifact_class: string
          author?: string | null
          content?: string | null
          content_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_canonical?: boolean
          kind: string
          metadata?: Json
          pattern_key?: string | null
          principle_anchors?: number[] | null
          slug: string
          source_session?: string | null
          status?: string
          storage_path?: string | null
          superseded_by_slug?: string | null
          surfaces?: string[]
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          artifact_class?: string
          author?: string | null
          content?: string | null
          content_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_canonical?: boolean
          kind?: string
          metadata?: Json
          pattern_key?: string | null
          principle_anchors?: number[] | null
          slug?: string
          source_session?: string | null
          status?: string
          storage_path?: string | null
          superseded_by_slug?: string | null
          surfaces?: string[]
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
