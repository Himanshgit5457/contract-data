import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  order: number;
}

export interface TableSetting {
  id?: string;
  table_name: string;
  visible: boolean;
  column_config: ColumnConfig[];
}

// Default columns for each table
export const DEFAULT_COLUMNS: Record<string, ColumnConfig[]> = {
  companies: [
    { key: "name", label: "Name", visible: true, order: 0 },
    { key: "type", label: "Type", visible: true, order: 1 },
    { key: "address", label: "Address", visible: true, order: 2 },
    { key: "registration_no", label: "Registration No.", visible: true, order: 3 },
    { key: "coordinates", label: "Coordinates", visible: true, order: 4 },
  ],
  contracts: [
    { key: "contract_code", label: "Contract Code", visible: true, order: 0 },
    { key: "resort", label: "Resort", visible: true, order: 1 },
    { key: "group", label: "Group", visible: true, order: 2 },
    { key: "sub_contract_type", label: "Type", visible: true, order: 3 },
    { key: "start_date", label: "Start Date", visible: true, order: 4 },
    { key: "end_date", label: "End Date", visible: true, order: 5 },
    { key: "status", label: "Status", visible: true, order: 6 },
  ],
  destinations: [
    { key: "name", label: "Name", visible: true, order: 0 },
    { key: "code", label: "Code", visible: true, order: 1 },
    { key: "coordinates", label: "Coordinates", visible: true, order: 2 },
  ],
};

export function useTableSettings() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["table_settings", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("table_settings")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      return data as any[];
    },
    enabled: !!userId,
  });

  const getSettingsForTable = (tableName: string): TableSetting => {
    const found = settings?.find((s: any) => s.table_name === tableName);
    if (found) {
      return {
        id: found.id,
        table_name: found.table_name,
        visible: found.visible,
        column_config: found.column_config as ColumnConfig[],
      };
    }
    return {
      table_name: tableName,
      visible: true,
      column_config: DEFAULT_COLUMNS[tableName] || [],
    };
  };

  const getVisibleColumns = (tableName: string): ColumnConfig[] => {
    const s = getSettingsForTable(tableName);
    return s.column_config
      .filter((c) => c.visible)
      .sort((a, b) => a.order - b.order);
  };

  const upsertMutation = useMutation({
    mutationFn: async (setting: TableSetting) => {
      if (!userId) throw new Error("Not authenticated");
      const payload = {
        user_id: userId,
        table_name: setting.table_name,
        visible: setting.visible,
        column_config: setting.column_config as any,
      };
      if (setting.id) {
        const { error } = await supabase
          .from("table_settings")
          .update(payload)
          .eq("id", setting.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("table_settings")
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["table_settings"] }),
  });

  return {
    settings,
    isLoading,
    getSettingsForTable,
    getVisibleColumns,
    upsertSetting: upsertMutation.mutateAsync,
    allTableNames: Object.keys(DEFAULT_COLUMNS),
  };
}
