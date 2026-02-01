export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      diary: {
        Row: {
          id: string;
          title: string;
          content: Json;
          emotion: string | null;
          weather: string | null;
          created_at: string;
          updated_at: string;
          diary_date: string;
        };
        Insert: {
          id?: string;
          title?: string;
          content?: Json;
          emotion?: string | null;
          weather?: string | null;
          created_at?: string;
          updated_at?: string;
          diary_date?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: Json;
          emotion?: string | null;
          weather?: string | null;
          created_at?: string;
          updated_at?: string;
          diary_date?: string;
        };
      };
    };
  };
}

export type Diary = Database["public"]["Tables"]["diary"]["Row"];
export type DiaryInsert = Database["public"]["Tables"]["diary"]["Insert"];
export type DiaryUpdate = Database["public"]["Tables"]["diary"]["Update"];
