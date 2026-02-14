import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ColumnInfo {
  column_name: string;
  data_type: string;
  udt_name: string;
  is_nullable: string;
  column_default: string | null;
  is_primary: boolean;
  is_foreign_key: boolean;
  fk_table: string | null;
  fk_column: string | null;
}

export interface TableInfo {
  table_name: string;
  columns: ColumnInfo[];
}

export interface NewColumn {
  name: string;
  type: string;
  is_nullable: boolean;
  default_value: string;
}

export interface ForeignKey {
  column_name: string;
  ref_table: string;
  on_delete: "cascade" | "set_null";
}

async function callSchemaManager(body: Record<string, unknown>) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const res = await supabase.functions.invoke("schema-manager", {
    body,
  });

  if (res.error) {
    throw new Error(res.error.message || "Schema operation failed");
  }
  
  // Check if the response data contains an error
  if (res.data?.error) {
    throw new Error(res.data.error);
  }

  return res.data;
}

export function useSchemaManager() {
  const queryClient = useQueryClient();

  const { data: schema, isLoading, error, refetch } = useQuery({
    queryKey: ["db_schema"],
    queryFn: async () => {
      const result = await callSchemaManager({ action: "get_schema" });
      return (result.tables || []) as TableInfo[];
    },
  });

  const addColumnMutation = useMutation({
    mutationFn: (params: {
      table_name: string;
      column_name: string;
      column_type: string;
      is_nullable?: boolean;
      default_value?: string;
    }) => callSchemaManager({ action: "add_column", ...params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["db_schema"] }),
  });

  const deleteColumnMutation = useMutation({
    mutationFn: (params: { table_name: string; column_name: string }) =>
      callSchemaManager({ action: "delete_column", ...params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["db_schema"] }),
  });

  const renameColumnMutation = useMutation({
    mutationFn: (params: { table_name: string; old_name: string; new_name: string }) =>
      callSchemaManager({ action: "rename_column", ...params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["db_schema"] }),
  });

  const createTableMutation = useMutation({
    mutationFn: (params: {
      table_name: string;
      columns: NewColumn[];
      foreign_keys?: ForeignKey[];
    }) => callSchemaManager({ action: "create_table", ...params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["db_schema"] }),
  });

  return {
    schema: schema || [],
    isLoading,
    error,
    refetch,
    addColumn: addColumnMutation.mutateAsync,
    deleteColumn: deleteColumnMutation.mutateAsync,
    renameColumn: renameColumnMutation.mutateAsync,
    createTable: createTableMutation.mutateAsync,
    isAddingColumn: addColumnMutation.isPending,
    isDeletingColumn: deleteColumnMutation.isPending,
    isRenamingColumn: renameColumnMutation.isPending,
    isCreatingTable: createTableMutation.isPending,
  };
}
