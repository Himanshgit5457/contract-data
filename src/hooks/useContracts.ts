import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useContracts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contracts")
        .select(`*, group:companies!contracts_group_id_fkey(name), resort:companies!contracts_resort_id_fkey(name)`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (contract: Record<string, unknown>) => {
      const { data, error } = await supabase.from("contracts").insert(contract as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast({ title: "Contract created successfully" });
    },
    onError: (error: Error) => {
      console.error("Database error:", error);
      toast({ title: "Operation failed", description: "Unable to create contract. Please try again.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...contract }: Record<string, unknown> & { id: string }) => {
      const { data, error } = await supabase.from("contracts").update(contract as any).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast({ title: "Contract updated successfully" });
    },
    onError: (error: Error) => {
      console.error("Database error:", error);
      toast({ title: "Operation failed", description: "Unable to update contract. Please try again.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contracts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast({ title: "Contract deleted successfully" });
    },
    onError: (error: Error) => {
      console.error("Database error:", error);
      toast({ title: "Operation failed", description: "Unable to delete contract. Please try again.", variant: "destructive" });
    },
  });

  return { ...query, createMutation, updateMutation, deleteMutation };
}

export function useContractDetail(contractId: string | null) {
  return useQuery({
    queryKey: ["contract-detail", contractId],
    enabled: !!contractId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contracts")
        .select(`*, group:companies!contracts_group_id_fkey(name), resort:companies!contracts_resort_id_fkey(name), pricing_standard(*), pricing_special(*), contract_baggage(*), contract_booking(*), contract_age(*), contract_addons(*), contract_insurance(*), contract_government_charges(*), contract_fuel(*), contract_payment_plan(*), contract_service_commitment(*), contract_termination(*), contract_notes(*)`)
        .eq("id", contractId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useDestinations() {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("destinations").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
}
