import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { AppProvider } from "@/store/AppContext";
import { Layout } from "@/components/Layout";
import { EditAppointmentSheet } from "@/components/EditAppointmentSheet";
import { CustomerDetailSheet } from "@/components/CustomerDetailSheet";
import { Toaster } from "@/components/ui/sonner";
import Dashboard from "@/pages/Dashboard";
import AllAppointments from "@/pages/AllAppointments";
import NewAppointment from "@/pages/NewAppointment";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Dashboard />
            </PageWrapper>
          }
        />
        <Route
          path="/randevular"
          element={
            <PageWrapper>
              <AllAppointments />
            </PageWrapper>
          }
        />
        <Route
          path="/yeni"
          element={
            <PageWrapper>
              <NewAppointment />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
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
