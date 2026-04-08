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
      activity_logs: {
        Row: {
          action: string
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          module: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          module: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          module?: string
          user_id?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          approved_by: string | null
          break_end: string | null
          break_start: string | null
          check_in: string | null
          check_out: string | null
          created_at: string | null
          employee_id: string
          id: string
          location_coords: Json | null
          notes: string | null
          overtime_hours: number | null
          status: string | null
          total_hours: number | null
          work_date: string | null
        }
        Insert: {
          approved_by?: string | null
          break_end?: string | null
          break_start?: string | null
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          employee_id: string
          id?: string
          location_coords?: Json | null
          notes?: string | null
          overtime_hours?: number | null
          status?: string | null
          total_hours?: number | null
          work_date?: string | null
        }
        Update: {
          approved_by?: string | null
          break_end?: string | null
          break_start?: string | null
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          employee_id?: string
          id?: string
          location_coords?: Json | null
          notes?: string | null
          overtime_hours?: number | null
          status?: string | null
          total_hours?: number | null
          work_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_permissions: {
        Row: {
          can_create: boolean
          can_delete: boolean
          can_edit: boolean
          can_export: boolean
          can_view: boolean
          created_at: string
          granted_by: string | null
          id: string
          module: string
          updated_at: string
          user_id: string
        }
        Insert: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_export?: boolean
          can_view?: boolean
          created_at?: string
          granted_by?: string | null
          id?: string
          module: string
          updated_at?: string
          user_id: string
        }
        Update: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_export?: boolean
          can_view?: boolean
          created_at?: string
          granted_by?: string | null
          id?: string
          module?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      employee_documents: {
        Row: {
          category: string
          description: string | null
          employee_id: string
          file_name: string | null
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          is_archived: boolean
          metadata: Json | null
          title: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          category: string
          description?: string | null
          employee_id: string
          file_name?: string | null
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_archived?: boolean
          metadata?: Json | null
          title: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          description?: string | null
          employee_id?: string
          file_name?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_archived?: boolean
          metadata?: Json | null
          title?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address_city: string | null
          address_complement: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zip: string | null
          avatar_url: string | null
          bank_account: string | null
          bank_branch: string | null
          bank_name: string | null
          birth_date: string | null
          contract_type: string | null
          cpf: string
          created_at: string | null
          created_by: string | null
          department: string | null
          email: string | null
          full_name: string
          hire_date: string
          id: string
          notes: string | null
          phone: string | null
          pix_key: string | null
          position: string | null
          registration_number: string
          rg: string | null
          salary: number | null
          status: string | null
          termination_date: string | null
          updated_at: string
          work_schedule: string | null
        }
        Insert: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          avatar_url?: string | null
          bank_account?: string | null
          bank_branch?: string | null
          bank_name?: string | null
          birth_date?: string | null
          contract_type?: string | null
          cpf: string
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          email?: string | null
          full_name: string
          hire_date: string
          id?: string
          notes?: string | null
          phone?: string | null
          pix_key?: string | null
          position?: string | null
          registration_number: string
          rg?: string | null
          salary?: number | null
          status?: string | null
          termination_date?: string | null
          updated_at?: string
          work_schedule?: string | null
        }
        Update: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          avatar_url?: string | null
          bank_account?: string | null
          bank_branch?: string | null
          bank_name?: string | null
          birth_date?: string | null
          contract_type?: string | null
          cpf?: string
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          email?: string | null
          full_name?: string
          hire_date?: string
          id?: string
          notes?: string | null
          phone?: string | null
          pix_key?: string | null
          position?: string | null
          registration_number?: string
          rg?: string | null
          salary?: number | null
          status?: string | null
          termination_date?: string | null
          updated_at?: string
          work_schedule?: string | null
        }
        Relationships: []
      }
      leaves: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          document_path: string | null
          employee_id: string
          end_date: string
          id: string
          notes: string | null
          reason: string | null
          start_date: string
          status: string
          total_days: number
          type: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          document_path?: string | null
          employee_id: string
          end_date: string
          id?: string
          notes?: string | null
          reason?: string | null
          start_date: string
          status?: string
          total_days: number
          type: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          document_path?: string | null
          employee_id?: string
          end_date?: string
          id?: string
          notes?: string | null
          reason?: string | null
          start_date?: string
          status?: string
          total_days?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaves_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      occurrences: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by_employee: boolean | null
          created_at: string | null
          created_by: string | null
          description: string
          employee_id: string
          evidence_path: string | null
          id: string
          occurrence_date: string
          resolution: string | null
          resolved_at: string | null
          severity: string | null
          type: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by_employee?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description: string
          employee_id: string
          evidence_path?: string | null
          id?: string
          occurrence_date: string
          resolution?: string | null
          resolved_at?: string | null
          severity?: string | null
          type: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by_employee?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          employee_id?: string
          evidence_path?: string | null
          id?: string
          occurrence_date?: string
          resolution?: string | null
          resolved_at?: string | null
          severity?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "occurrences_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      payslips: {
        Row: {
          bonuses: Json | null
          created_at: string
          deductions: Json | null
          employee_id: string
          file_name: string | null
          file_path: string | null
          gross_salary: number | null
          id: string
          net_salary: number | null
          notes: string | null
          reference_month: string
          uploaded_by: string | null
        }
        Insert: {
          bonuses?: Json | null
          created_at?: string
          deductions?: Json | null
          employee_id: string
          file_name?: string | null
          file_path?: string | null
          gross_salary?: number | null
          id?: string
          net_salary?: number | null
          notes?: string | null
          reference_month: string
          uploaded_by?: string | null
        }
        Update: {
          bonuses?: Json | null
          created_at?: string
          deductions?: Json | null
          employee_id?: string
          file_name?: string | null
          file_path?: string | null
          gross_salary?: number | null
          id?: string
          net_salary?: number | null
          notes?: string | null
          reference_month?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payslips_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      position_history: {
        Row: {
          created_at: string
          created_by: string | null
          department: string | null
          employee_id: string
          end_date: string | null
          id: string
          position: string
          reason: string | null
          salary: number | null
          start_date: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          department?: string | null
          employee_id: string
          end_date?: string | null
          id?: string
          position: string
          reason?: string | null
          salary?: number | null
          start_date: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          department?: string | null
          employee_id?: string
          end_date?: string | null
          id?: string
          position?: string
          reason?: string | null
          salary?: number | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "position_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          is_active: boolean
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_permission: {
        Args: { p_action: string; p_module: string }
        Returns: boolean
      }
      is_admin: { Args: Record<string, never>; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
