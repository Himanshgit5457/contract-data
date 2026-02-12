import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { CompanyTable } from "@/components/companies/CompanyTable";
import { ContractTable } from "@/components/contracts/ContractTable";

const Index = () => {
  const [activeTab, setActiveTab] = useState("Resort Data");

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-6 py-8">
        {activeTab === "Resort Data" ? <CompanyTable /> : <ContractTable />}
      </main>
    </div>
  );
};

export default Index;
