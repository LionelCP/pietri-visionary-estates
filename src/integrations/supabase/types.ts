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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      properties: {
        Row: {
          area_m2: number | null
          bathrooms: number | null
          bedrooms: number | null
          city: string | null
          coup_de_coeur: boolean
          created_at: string
          display_order: number
          energy_class: string | null
          featured: boolean
          floor: string | null
          gallery: Json
          has_balcony: boolean
          has_garden: boolean
          has_mountain_view: boolean
          has_open_view: boolean
          has_sea_view: boolean
          has_terrace: boolean
          highlights: string[]
          id: string
          internal_ref: string | null
          long_description: string | null
          long_description_en: string | null
          main_image_url: string | null
          matterport_id: string | null
          plan_pdf_url: string | null
          price_amount: number | null
          price_display: string | null
          price_on_request: boolean
          property_type: Database["public"]["Enums"]["property_type"] | null
          region: Database["public"]["Enums"]["property_region"] | null
          rooms: number | null
          sector: string | null
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          short_description_en: string | null
          slug: string
          status: Database["public"]["Enums"]["property_status"]
          title: string
          updated_at: string
        }
        Insert: {
          area_m2?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          coup_de_coeur?: boolean
          created_at?: string
          display_order?: number
          energy_class?: string | null
          featured?: boolean
          floor?: string | null
          gallery?: Json
          has_balcony?: boolean
          has_garden?: boolean
          has_mountain_view?: boolean
          has_open_view?: boolean
          has_sea_view?: boolean
          has_terrace?: boolean
          highlights?: string[]
          id?: string
          internal_ref?: string | null
          long_description?: string | null
          long_description_en?: string | null
          main_image_url?: string | null
          matterport_id?: string | null
          plan_pdf_url?: string | null
          price_amount?: number | null
          price_display?: string | null
          price_on_request?: boolean
          property_type?: Database["public"]["Enums"]["property_type"] | null
          region?: Database["public"]["Enums"]["property_region"] | null
          rooms?: number | null
          sector?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          short_description_en?: string | null
          slug: string
          status?: Database["public"]["Enums"]["property_status"]
          title: string
          updated_at?: string
        }
        Update: {
          area_m2?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          coup_de_coeur?: boolean
          created_at?: string
          display_order?: number
          energy_class?: string | null
          featured?: boolean
          floor?: string | null
          gallery?: Json
          has_balcony?: boolean
          has_garden?: boolean
          has_mountain_view?: boolean
          has_open_view?: boolean
          has_sea_view?: boolean
          has_terrace?: boolean
          highlights?: string[]
          id?: string
          internal_ref?: string | null
          long_description?: string | null
          long_description_en?: string | null
          main_image_url?: string | null
          matterport_id?: string | null
          plan_pdf_url?: string | null
          price_amount?: number | null
          price_display?: string | null
          price_on_request?: boolean
          property_type?: Database["public"]["Enums"]["property_type"] | null
          region?: Database["public"]["Enums"]["property_region"] | null
          rooms?: number | null
          sector?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          short_description_en?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["property_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
      property_region: "corse" | "continent" | "monaco" | "bali" | "autre"
      property_status:
        | "disponible"
        | "sous_offre"
        | "vendu"
        | "reserve"
        | "masque"
      property_type:
        | "appartement"
        | "maison"
        | "villa"
        | "terrain"
        | "local_commercial"
        | "programme"
        | "autre"
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
      app_role: ["admin"],
      property_region: ["corse", "continent", "monaco", "bali", "autre"],
      property_status: [
        "disponible",
        "sous_offre",
        "vendu",
        "reserve",
        "masque",
      ],
      property_type: [
        "appartement",
        "maison",
        "villa",
        "terrain",
        "local_commercial",
        "programme",
        "autre",
      ],
    },
  },
} as const
