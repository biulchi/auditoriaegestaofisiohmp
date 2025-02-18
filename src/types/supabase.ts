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
      "Auditoria Fisio": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      mechanical_ventilation_audits: {
        Row: {
          assincronia: boolean[]
          circuit_positioned: boolean[]
          created_at: string | null
          cuff_pressure: boolean[]
          date: string
          dp_under_15: boolean[]
          humidification: boolean[]
          id: number
          observation: string | null
          responsible: string
          sfa: boolean[]
          spo2: boolean[]
          time: string
          vc_6_8: boolean[]
        }
        Insert: {
          assincronia?: boolean[]
          circuit_positioned?: boolean[]
          created_at?: string | null
          cuff_pressure?: boolean[]
          date: string
          dp_under_15?: boolean[]
          humidification?: boolean[]
          id?: never
          observation?: string | null
          responsible: string
          sfa?: boolean[]
          spo2?: boolean[]
          time: string
          vc_6_8?: boolean[]
        }
        Update: {
          assincronia?: boolean[]
          circuit_positioned?: boolean[]
          created_at?: string | null
          cuff_pressure?: boolean[]
          date?: string
          dp_under_15?: boolean[]
          humidification?: boolean[]
          id?: never
          observation?: string | null
          responsible?: string
          sfa?: boolean[]
          spo2?: boolean[]
          time?: string
          vc_6_8?: boolean[]
        }
        Relationships: []
      }
      physiotherapy_indicators: {
        Row: {
          admissions: number
          beds_occupied: number | null
          calculated_average_los: number | null
          calculated_occupancy_rate: number | null
          calculated_weaning_rate: number | null
          created_at: string
          date: string
          discharges: number
          early_mobilization_rate: number
          extubations: number
          failed_extubations: number
          id: number
          mechanical_ventilation_days: number
          month: number
          physiotherapy_treatments: number
          vap_cases: number
          year: number
        }
        Insert: {
          admissions: number
          beds_occupied?: number | null
          calculated_average_los?: number | null
          calculated_occupancy_rate?: number | null
          calculated_weaning_rate?: number | null
          created_at?: string
          date: string
          discharges: number
          early_mobilization_rate: number
          extubations: number
          failed_extubations: number
          id?: never
          mechanical_ventilation_days: number
          month: number
          physiotherapy_treatments: number
          vap_cases: number
          year: number
        }
        Update: {
          admissions?: number
          beds_occupied?: number | null
          calculated_average_los?: number | null
          calculated_occupancy_rate?: number | null
          calculated_weaning_rate?: number | null
          created_at?: string
          date?: string
          discharges?: number
          early_mobilization_rate?: number
          extubations?: number
          failed_extubations?: number
          id?: never
          mechanical_ventilation_days?: number
          month?: number
          physiotherapy_treatments?: number
          vap_cases?: number
          year?: number
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
