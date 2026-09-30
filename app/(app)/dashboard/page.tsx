import PageHeader from "@/components/shared/page-header";

async function Dashboardpage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="An overview of CRM will live here."
      />
      <p className="text-sm text-muted-foreground">Coming in later version</p>
    </>
  );
}

export default Dashboardpage;
