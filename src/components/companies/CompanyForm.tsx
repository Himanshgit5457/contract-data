import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { companySchema, CompanyFormData } from "@/lib/validations";
import { useCompanies } from "@/hooks/useCompanies";
import { useEffect } from "react";

interface CompanyFormProps {
  open: boolean;
  onClose: () => void;
  company?: any;
}

export function CompanyForm({ open, onClose, company }: CompanyFormProps) {
  const { createMutation, updateMutation } = useCompanies();
  const isEdit = !!company;

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: { name: "", type: "Resort", address: "", registration_no: "", coordinates: "" },
  });

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name,
        type: company.type,
        address: company.address || "",
        registration_no: company.registration_no || "",
        coordinates: company.coordinates || "",
      });
    } else {
      form.reset({ name: "", type: "Resort", address: "", registration_no: "", coordinates: "" });
    }
  }, [company, form]);

  const onSubmit = async (data: CompanyFormData) => {
    if (isEdit) {
      await updateMutation.mutateAsync({ id: company.id, name: data.name, type: data.type, address: data.address, registration_no: data.registration_no, coordinates: data.coordinates });
    } else {
      await createMutation.mutateAsync({ name: data.name, type: data.type, address: data.address, registration_no: data.registration_no, coordinates: data.coordinates });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Company" : "Add Company"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>Type <span className="text-destructive">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Group">Group</SelectItem>
                    <SelectItem value="Resort">Resort</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="registration_no" render={({ field }) => (
              <FormItem>
                <FormLabel>Registration No.</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="coordinates" render={({ field }) => (
              <FormItem>
                <FormLabel>Coordinates</FormLabel>
                <FormControl><Input {...field} placeholder="Lat, Long" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="btn-gradient-primary" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
