export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      chapter_claims: {
        Row: {
          chapter_id: string;
          claimed_at: string;
          checkout_url: string | null;
          display_name: string;
          guest_id: string;
          id: string;
          item_id: string;
          order_id: string | null;
          shopify_variant: string | null;
          state: string;
        };
        Insert: {
          chapter_id: string;
          claimed_at?: string;
          checkout_url?: string | null;
          display_name?: string;
          guest_id: string;
          id?: string;
          item_id: string;
          order_id?: string | null;
          shopify_variant?: string | null;
          state?: string;
        };
        Update: {
          chapter_id?: string;
          claimed_at?: string;
          checkout_url?: string | null;
          display_name?: string;
          guest_id?: string;
          id?: string;
          item_id?: string;
          order_id?: string | null;
          shopify_variant?: string | null;
          state?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chapter_claims_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chapter_claims_guest_id_fkey";
            columns: ["guest_id"];
            isOneToOne: false;
            referencedRelation: "chapter_guests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chapter_claims_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: true;
            referencedRelation: "chapter_items";
            referencedColumns: ["id"];
          },
        ];
      };
      chapter_guests: {
        Row: {
          chapter_id: string;
          created_at: string;
          guest_token: string;
          id: string;
          invite_attempted_at: string | null;
          is_revoked: boolean;
        };
        Insert: {
          chapter_id: string;
          created_at?: string;
          guest_token: string;
          id?: string;
          invite_attempted_at?: string | null;
          is_revoked?: boolean;
        };
        Update: {
          chapter_id?: string;
          created_at?: string;
          guest_token?: string;
          id?: string;
          invite_attempted_at?: string | null;
          is_revoked?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "chapter_guests_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
        ];
      };
      chapter_items: {
        Row: {
          chapter_id: string;
          id: string;
          name: string;
          photo_url: string | null;
          position: number;
          price: number | null;
          source: string | null;
          source_url: string | null;
          status: string;
          why: string | null;
        };
        Insert: {
          chapter_id: string;
          id?: string;
          name: string;
          photo_url?: string | null;
          position?: number;
          price?: number | null;
          source?: string | null;
          source_url?: string | null;
          status?: string;
          why?: string | null;
        };
        Update: {
          chapter_id?: string;
          id?: string;
          name?: string;
          photo_url?: string | null;
          position?: number;
          price?: number | null;
          source?: string | null;
          source_url?: string | null;
          status?: string;
          why?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chapter_items_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
        ];
      };
      chapters: {
        Row: {
          accept_token: string | null;
          chapter_type: string;
          created_at: string;
          decline_token: string | null;
          id: string;
          person_decided_at: string | null;
          person_decision: string;
          person_token: string | null;
          starter_name: string;
          state: string;
          story_line: string | null;
          title: string;
        };
        Insert: {
          accept_token?: string | null;
          chapter_type?: string;
          created_at?: string;
          decline_token?: string | null;
          id?: string;
          person_decided_at?: string | null;
          person_decision?: string;
          person_token?: string | null;
          starter_name?: string;
          state?: string;
          story_line?: string | null;
          title: string;
        };
        Update: {
          accept_token?: string | null;
          chapter_type?: string;
          created_at?: string;
          decline_token?: string | null;
          id?: string;
          person_decided_at?: string | null;
          person_decision?: string;
          person_token?: string | null;
          starter_name?: string;
          state?: string;
          story_line?: string | null;
          title?: string;
        };
        Relationships: [];
      };
      payment_conflicts: {
        Row: {
          claim_id: string;
          order_id: string;
          quantity: number;
        };
        Insert: {
          claim_id: string;
          order_id: string;
          quantity: number;
        };
        Update: {
          claim_id?: string;
          order_id?: string;
          quantity?: number;
        };
        Relationships: [];
      };
      released_claims: {
        Row: {
          chapter_id: string;
          id: string;
          item_id: string;
          order_id: string | null;
          reason: string;
          released_at: string;
          shopify_variant: string | null;
        };
        Insert: {
          chapter_id: string;
          id: string;
          item_id: string;
          order_id?: string | null;
          reason: string;
          released_at?: string;
          shopify_variant?: string | null;
        };
        Update: {
          chapter_id?: string;
          id?: string;
          item_id?: string;
          order_id?: string | null;
          reason?: string;
          released_at?: string;
          shopify_variant?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "released_claims_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "released_claims_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "chapter_items";
            referencedColumns: ["id"];
          },
        ];
      };
      waitlist_signups: {
        Row: {
          chapter: string | null;
          comments: string | null;
          contact_name: string | null;
          created_at: string;
          email: string;
          id: string;
          organization: string | null;
          role_title: string | null;
          team_size: string | null;
        };
        Insert: {
          chapter?: string | null;
          comments?: string | null;
          contact_name?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          organization?: string | null;
          role_title?: string | null;
          team_size?: string | null;
        };
        Update: {
          chapter?: string | null;
          comments?: string | null;
          contact_name?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          organization?: string | null;
          role_title?: string | null;
          team_size?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      claim_good_chapter_item: {
        Args: {
          p_display_name: string;
          p_guest_token: string;
          p_item_id: string;
        };
        Returns: {
          claim_id: string;
          claim_state: string;
          display_name: string;
        }[];
      };
      remove_good_chapter_item: {
        Args: {
          p_item_id: string;
          p_person_token: string;
        };
        Returns: boolean;
      };
      reserve_good_chapter_invites: {
        Args: {
          p_chapter_id: string;
          p_guest_ids: string[];
        };
        Returns: {
          guest_token: string;
          id: string;
          invite_attempted_at: string;
        }[];
      };
      record_good_chapter_paid_order: {
        Args: {
          p_lines: Json;
          p_order_id: string;
          p_order_valid: boolean;
        };
        Returns: undefined;
      };
      release_good_chapter_claim: {
        Args: {
          p_claim_id: string;
          p_reason: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
