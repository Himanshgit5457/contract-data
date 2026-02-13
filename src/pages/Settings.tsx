import { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableSettingsModal } from "@/components/settings/TableSettingsModal";

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
          <h3 className="text-lg font-semibold text-foreground">Table & Column Configuration</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Control which tables appear in the navigation and configure column visibility and order for each table.
          </p>
        </div>
        <Button onClick={() => setShowTableSettings(true)} className="btn-gradient-primary">
          Configure Tables
        </Button>
      </div>

      <TableSettingsModal open={showTableSettings} onClose={() => setShowTableSettings(false)} />
    </div>
  );
}
