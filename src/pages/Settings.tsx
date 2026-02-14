import { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableSettingsModal } from "@/components/settings/TableSettingsModal";
import { SchemaManager } from "@/components/settings/SchemaManager";

export default function SettingsPage() {
  const [showTableSettings, setShowTableSettings] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Display Configuration</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Control which tables appear in the navigation and configure column visibility and order for each table.
          </p>
        </div>
        <Button onClick={() => setShowTableSettings(true)} className="btn-gradient-primary">
          Configure Display
        </Button>
      </div>

      <div className="glass-card p-6">
        <SchemaManager />
      </div>

      <TableSettingsModal open={showTableSettings} onClose={() => setShowTableSettings(false)} />
    </div>
  );
}
