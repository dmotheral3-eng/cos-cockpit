// Minimal hand-crafted slice of the master OS schema.
// Full schema is ~940KB; only the two write-target tables used by the
// promote action are typed here. Regenerate via `supabase gen types`
// or expand as additional tables are read/written.

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
      dave_cockpit_jsx_intake: {
        Row: {
          id: string
          logged_at: string
          artifact_filename: string
          artifact_path: string | null
          artifact_chars: number | null
          user_signal: string
          signal_quote: string | null
          session_context: string | null
          proposed_pattern_key: string | null
          proposed_pattern_name: string | null
          candidate_palette: Json
          candidate_layout: string | null
          candidate_use_cases: string[] | null
          status: string
          promoted_to_pattern_key: string | null
          reviewed_at: string | null
          reviewed_note: string | null
        }
        Insert: {
          id?: string
          logged_at?: string
          artifact_filename: string
          artifact_path?: string | null
          artifact_chars?: number | null
          user_signal: string
          signal_quote?: string | null
          session_context?: string | null
          proposed_pattern_key?: string | null
          proposed_pattern_name?: string | null
          candidate_palette?: Json
          candidate_layout?: string | null
          candidate_use_cases?: string[] | null
          status?: string
          promoted_to_pattern_key?: string | null
          reviewed_at?: string | null
          reviewed_note?: string | null
        }
        Update: {
          id?: string
          logged_at?: string
          artifact_filename?: string
          artifact_path?: string | null
          artifact_chars?: number | null
          user_signal?: string
          signal_quote?: string | null
          session_context?: string | null
          proposed_pattern_key?: string | null
          proposed_pattern_name?: string | null
          candidate_palette?: Json
          candidate_layout?: string | null
          candidate_use_cases?: string[] | null
          status?: string
          promoted_to_pattern_key?: string | null
          reviewed_at?: string | null
          reviewed_note?: string | null
        }
        Relationships: []
      }
      dave_cockpit_jsx_patterns: {
        Row: {
          id: string
          pattern_key: string
          pattern_name: string
          description: string | null
          palette_paper: string | null
          palette_ink: string | null
          palette_accent: string | null
          palette_extra: Json
          font_serif: string | null
          font_mono: string | null
          font_sans: string | null
          layout_pattern: string | null
          use_cases: string[] | null
          principle_anchor: number | null
          example_files: string[] | null
          canonical_snippet: string | null
          approved_at: string | null
          approved_by: string | null
          superseded_by_pattern_key: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pattern_key: string
          pattern_name: string
          description?: string | null
          palette_paper?: string | null
          palette_ink?: string | null
          palette_accent?: string | null
          palette_extra?: Json
          font_serif?: string | null
          font_mono?: string | null
          font_sans?: string | null
          layout_pattern?: string | null
          use_cases?: string[] | null
          principle_anchor?: number | null
          example_files?: string[] | null
          canonical_snippet?: string | null
          approved_at?: string | null
          approved_by?: string | null
          superseded_by_pattern_key?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pattern_key?: string
          pattern_name?: string
          description?: string | null
          palette_paper?: string | null
          palette_ink?: string | null
          palette_accent?: string | null
          palette_extra?: Json
          font_serif?: string | null
          font_mono?: string | null
          font_sans?: string | null
          layout_pattern?: string | null
          use_cases?: string[] | null
          principle_anchor?: number | null
          example_files?: string[] | null
          canonical_snippet?: string | null
          approved_at?: string | null
          approved_by?: string | null
          superseded_by_pattern_key?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
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
