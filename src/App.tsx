import { AppProvider, useApp } from "@/store/AppContext";
import { Layout } from "@/components/Layout";
import { EditAppointmentSheet } from "@/components/EditAppointmentSheet";
import { CustomerDetailSheet } from "@/components/CustomerDetailSheet";
import { Toaster } from "@/components/ui/sonner";
import Dashboard from "@/pages/Dashboard";
import AllAppointments from "@/pages/AllAppointments";
import NewAppointment from "@/pages/NewAppointment";

function AppRoutes() {
  const { state } = useApp();

  switch (state.activePage) {
    case "dashboard":
      return <Dashboard />;
    case "appointments":
      return <AllAppointments />;
    case "new":
      return <NewAppointment />;
    default:
      return <Dashboard />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <AppRoutes />
      </Layout>
      <EditAppointmentSheet />
      <CustomerDetailSheet />
      <Toaster richColors position="top-center" />
    </AppProvider>
  );
}
