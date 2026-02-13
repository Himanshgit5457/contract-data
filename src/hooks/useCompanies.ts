import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useCompanies() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (company: { name: string; type: string; address?: string; registration_no?: string; coordinates?: string }) => {
      const { data, error } = await supabase.from("companies").insert(company).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Company created successfully" });
    },
    onError: (error: Error) => {
      console.error("Database error:", error);
      toast({ title: "Operation failed", description: "Unable to create company. Please try again.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...company }: { id: string; name: string; type: string; address?: string; registration_no?: string; coordinates?: string }) => {
      const { data, error } = await supabase.from("companies").update(company).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Company updated successfully" });
    },
    onError: (error: Error) => {
      console.error("Database error:", error);
      toast({ title: "Operation failed", description: "Unable to update company. Please try again.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("companies").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Company deleted successfully" });
    },
    onError: (error: Error) => {
      console.error("Database error:", error);
      toast({ title: "Operation failed", description: "Unable to delete company. Please try again.", variant: "destructive" });
    },
  });

  return { ...query, createMutation, updateMutation, deleteMutation };
}
