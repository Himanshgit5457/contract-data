import { useState, useMemo } from "react";
import { Search, Plus, Building2, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompanies } from "@/hooks/useCompanies";
import { useTableSettings } from "@/hooks/useTableSettings";
import { CompanyForm } from "./CompanyForm";
import { CompanyDeleteDialog } from "./CompanyDeleteDialog";

export function CompanyTable() {
  const { data: companies, isLoading } = useCompanies();
  const { getVisibleColumns } = useTableSettings();
  const columns = getVisibleColumns("companies");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [editCompany, setEditCompany] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteCompany, setDeleteCompany] = useState<any>(null);

  const filtered = useMemo(() => {
    if (!companies) return [];
    return companies.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.registration_no || "").toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "All" || c.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [companies, search, typeFilter]);

  const getCellValue = (company: any, key: string) => {
    if (key === "type") {
      return (
        <Badge variant={company.type === "Group" ? "default" : "secondary"} className={company.type === "Group" ? "bg-primary/20 text-primary border-0" : "bg-success/20 text-success border-0"}>
          {company.type}
        </Badge>
      );
    }
    return company[key] || "—";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Resort Data</h2>
        </div>
        <Button className="btn-gradient-primary rounded-lg" onClick={() => { setEditCompany(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Company
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or registration no..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Group">Group</SelectItem>
            <SelectItem value="Resort">Resort</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={col.key} className="text-muted-foreground font-semibold">{col.label}</TableHead>
              ))}
              <TableHead className="text-muted-foreground font-semibold w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={columns.length + 1}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={columns.length + 1} className="text-center py-12 text-muted-foreground">No companies found.</TableCell></TableRow>
            ) : (
              filtered.map((company) => (
                <TableRow key={company.id} className="data-table-row">
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.key === "name" ? "font-medium" : col.key === "address" ? "text-muted-foreground max-w-[200px] truncate" : "text-muted-foreground"}>
                      {getCellValue(company, col.key)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditCompany(company); setShowForm(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteCompany(company)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CompanyForm open={showForm} onClose={() => setShowForm(false)} company={editCompany} />
      <CompanyDeleteDialog company={deleteCompany} onClose={() => setDeleteCompany(null)} />
    </div>
  );
}
