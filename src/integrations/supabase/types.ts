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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          address: string | null
          coordinates: string | null
          created_at: string | null
          id: string
          name: string
          registration_no: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          coordinates?: string | null
          created_at?: string | null
          id?: string
          name: string
          registration_no?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          coordinates?: string | null
          created_at?: string | null
          id?: string
          name?: string
          registration_no?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contract_addons: {
        Row: {
          created_at: string | null
          id: string
          remark: string | null
          sub_category: string
          sub_contract_id: string | null
          type: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          remark?: string | null
          sub_category: string
          sub_contract_id?: string | null
          type: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          remark?: string | null
          sub_category?: string
          sub_contract_id?: string | null
          type?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "contract_addons_sub_contract_id_fkey"
            columns: ["sub_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["sub_contract_id"]
          },
        ]
      }
      contract_age: {
        Row: {
          created_at: string | null
          id: string
          max_age: number | null
          min_age: number
          sub_contract_id: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_age?: number | null
          min_age: number
          sub_contract_id?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          max_age?: number | null
          min_age?: number
          sub_contract_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_age_sub_contract_id_fkey"
            columns: ["sub_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["sub_contract_id"]
          },
        ]
      }
      contract_baggage: {
        Row: {
          created_at: string | null
          id: string
          parameter: string
          remark: string | null
          sub_contract_id: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          parameter: string
          remark?: string | null
          sub_contract_id?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          parameter?: string
          remark?: string | null
          sub_contract_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_baggage_sub_contract_id_fkey"
            columns: ["sub_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["sub_contract_id"]
          },
        ]
      }
      contract_booking: {
        Row: {
          created_at: string | null
          id: string
          parameter: string
          remark: string | null
          sub_contract_id: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          parameter: string
          remark?: string | null
          sub_contract_id?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          parameter?: string
          remark?: string | null
          sub_contract_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_booking_sub_contract_id_fkey"
            columns: ["sub_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["sub_contract_id"]
          },
        ]
      }
      contract_fuel: {
        Row: {
          created_at: string | null
          id: string
          remark: string | null
          sub_contract_id: string | null
          type: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          remark?: string | null
          sub_contract_id?: string | null
          type: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          remark?: string | null
          sub_contract_id?: string | null
          type?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "contract_fuel_sub_contract_id_fkey"
            columns: ["sub_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["sub_contract_id"]
          },
        ]
      }
      contract_government_charges: {
        Row: {
          created_at: string | null
          id: string
          parameter: string
          remark: string | null
          sub_contract_id: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          parameter: string
          remark?: string | null
          sub_contract_id?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          parameter?: string
          remark?: string | null
          sub_contract_id?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "contract_government_charges_sub_contract_id_fkey"
            columns: ["sub_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["sub_contract_id"]
          },
        ]
      }
      contract_insurance: {
        Row: {
          created_at: string | null
          id: string
          parameter: string
          remark: string | null
          sub_contract_id: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          parameter: string
          remark?: string | null
          sub_contract_id?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          parameter?: string
          remark?: string | null
          sub_contract_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_insurance_sub_contract_id_fkey"
            columns: ["sub_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["sub_contract_id"]
          },
        ]
      }
      contract_notes: {
        Row: {
          content: string | null
          contract_id: string | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          contract_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          contract_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_notes_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_payment_plan: {
        Row: {
          created_at: string | null
          id: string
          parameter: string
          remark: string | null
          sub_contract_id: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          parameter: string
          remark?: string | null
          sub_contract_id?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          parameter?: string
          remark?: string | null
          sub_contract_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_payment_plan_sub_contract_id_fkey"
            columns: ["sub_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["sub_contract_id"]
          },
        ]
      }
      contract_service_commitment: {
        Row: {
          created_at: string | null
          id: string
          parameter: string
          remark: string | null
          sub_contract_id: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          parameter: string
          remark?: string | null
          sub_contract_id?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          parameter?: string
          remark?: string | null
          sub_contract_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_service_commitment_sub_contract_id_fkey"
            columns: ["sub_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["sub_contract_id"]
          },
        ]
      }
      contract_termination: {
        Row: {
          created_at: string | null
          id: string
          parameter: string
          remark: string | null
          sub_contract_id: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          parameter: string
          remark?: string | null
          sub_contract_id?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          parameter?: string
          remark?: string | null
          sub_contract_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_termination_sub_contract_id_fkey"
            columns: ["sub_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["sub_contract_id"]
          },
        ]
      }
      contracts: {
        Row: {
          agreement_type: string | null
          carrier_id: string | null
          contract_code: string
          contract_id: string
          created_at: string | null
          end_date: string
          group_id: string | null
          id: string
          resort_id: string | null
          start_date: string
          sub_contract_id: string | null
          sub_contract_type: string | null
          updated_at: string | null
        }
        Insert: {
          agreement_type?: string | null
          carrier_id?: string | null
          contract_code: string
          contract_id: string
          created_at?: string | null
          end_date: string
          group_id?: string | null
          id?: string
          resort_id?: string | null
          start_date: string
          sub_contract_id?: string | null
          sub_contract_type?: string | null
          updated_at?: string | null
        }
        Update: {
          agreement_type?: string | null
          carrier_id?: string | null
          contract_code?: string
          contract_id?: string
          created_at?: string | null
          end_date?: string
          group_id?: string | null
          id?: string
          resort_id?: string | null
          start_date?: string
          sub_contract_id?: string | null
          sub_contract_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_resort_id_fkey"
            columns: ["resort_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          code: string | null
          coordinates: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code?: string | null
          coordinates?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string | null
          coordinates?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      pricing_special: {
        Row: {
          created_at: string | null
          discount_type: string | null
          end_date: string | null
          id: string
          one_way_fare_usd: number | null
          pax_condition: string | null
          request_type: string | null
          return_fare_usd: number | null
          start_date: string | null
          sub_contract_id: string | null
        }
        Insert: {
          created_at?: string | null
          discount_type?: string | null
          end_date?: string | null
          id?: string
          one_way_fare_usd?: number | null
          pax_condition?: string | null
          request_type?: string | null
          return_fare_usd?: number | null
          start_date?: string | null
          sub_contract_id?: string | null
        }
        Update: {
          created_at?: string | null
          discount_type?: string | null
          end_date?: string | null
          id?: string
          one_way_fare_usd?: number | null
          pax_condition?: string | null
          request_type?: string | null
          return_fare_usd?: number | null
          start_date?: string | null
          sub_contract_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_special_sub_contract_id_fkey"
            columns: ["sub_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["sub_contract_id"]
          },
        ]
      }
      pricing_standard: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          one_way_fare_usd: number | null
          passenger_type: string | null
          pax_condition: string | null
          point_a_id: string | null
          point_b_id: string | null
          return_fare_usd: number | null
          start_date: string | null
          sub_contract_id: string | null
          transfer_type: string | null
          weekdays: string[]
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          one_way_fare_usd?: number | null
          passenger_type?: string | null
          pax_condition?: string | null
          point_a_id?: string | null
          point_b_id?: string | null
          return_fare_usd?: number | null
          start_date?: string | null
          sub_contract_id?: string | null
          transfer_type?: string | null
          weekdays: string[]
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          one_way_fare_usd?: number | null
          passenger_type?: string | null
          pax_condition?: string | null
          point_a_id?: string | null
          point_b_id?: string | null
          return_fare_usd?: number | null
          start_date?: string | null
          sub_contract_id?: string | null
          transfer_type?: string | null
          weekdays?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "pricing_standard_point_a_id_fkey"
            columns: ["point_a_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_standard_point_b_id_fkey"
            columns: ["point_b_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_standard_sub_contract_id_fkey"
            columns: ["sub_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["sub_contract_id"]
          },
        ]
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
