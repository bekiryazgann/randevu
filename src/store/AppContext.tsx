import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import type { Appointment, AppointmentStatus, ServiceRecord, Vehicle } from "@/types";
import { appointments as initialAppointments, serviceRecords as initialServiceRecords, customers } from "@/data/mock";

interface AppState {
  appointments: Appointment[];
  serviceRecords: ServiceRecord[];
  activePage: "dashboard" | "appointments" | "new";
  selectedCustomerId: string | null;
  selectedAppointmentId: string | null;
}

type AppAction =
  | { type: "SET_PAGE"; page: AppState["activePage"] }
  | { type: "SELECT_CUSTOMER"; customerId: string | null }
  | { type: "SELECT_APPOINTMENT"; appointmentId: string | null }
  | { type: "ADD_APPOINTMENT"; appointment: Appointment }
  | { type: "UPDATE_APPOINTMENT"; appointment: Appointment }
  | { type: "UPDATE_APPOINTMENT_STATUS"; id: string; status: AppointmentStatus }
  | { type: "DELETE_APPOINTMENT"; id: string };

function getTodayAppointments(appts: Appointment[]) {
  const today = new Date().toISOString().split("T")[0];
  return appts.filter((a) => a.date === today);
}

const initialState: AppState = {
  appointments: initialAppointments,
  serviceRecords: initialServiceRecords,
  activePage: "dashboard",
  selectedCustomerId: null,
  selectedAppointmentId: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, activePage: action.page, selectedCustomerId: null };

    case "SELECT_CUSTOMER":
      return { ...state, selectedCustomerId: action.customerId };

    case "SELECT_APPOINTMENT":
      return { ...state, selectedAppointmentId: action.appointmentId };

    case "ADD_APPOINTMENT":
      return { ...state, appointments: [...state.appointments, action.appointment] };

    case "UPDATE_APPOINTMENT":
      return {
        ...state,
        appointments: state.appointments.map((a) =>
          a.id === action.appointment.id ? action.appointment : a
        ),
      };

    case "UPDATE_APPOINTMENT_STATUS":
      return {
        ...state,
        appointments: state.appointments.map((a) =>
          a.id === action.id ? { ...a, status: action.status } : a
        ),
      };

    case "DELETE_APPOINTMENT":
      return {
        ...state,
        appointments: state.appointments.filter((a) => a.id !== action.id),
      };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
  todayAppointments: Appointment[];
  getCustomerById: (id: string) => typeof customers[0] | undefined;
  getCustomerAppointments: (customerId: string) => Appointment[];
  getCustomerServiceRecords: (customerId: string) => ServiceRecord[];
  getVehicleById: (id: string) => Vehicle | undefined;
  getTodaySummary: () => { total: number; bekliyor: number; geldi: number; tamamlandi: number; iptal: number };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const todayAppointments = getTodayAppointments(state.appointments);

  const getCustomerById = (id: string) => customers.find((c) => c.id === id);

  const getCustomerAppointments = (customerId: string) =>
    state.appointments.filter((a) => a.customerId === customerId);

  const getCustomerServiceRecords = (customerId: string) =>
    state.serviceRecords.filter((r) => r.customerId === customerId);

  const getVehicleById = (id: string) => {
    for (const c of customers) {
      const v = c.vehicles.find((v) => v.id === id);
      if (v) return v;
    }
    return undefined;
  };

  const getTodaySummary = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayList = state.appointments.filter((a) => a.date === today);
    return {
      total: todayList.length,
      bekliyor: todayList.filter((a) => a.status === "bekliyor").length,
      geldi: todayList.filter((a) => a.status === "geldi").length,
      tamamlandi: todayList.filter((a) => a.status === "tamamlandi").length,
      iptal: todayList.filter((a) => a.status === "iptal").length,
    };
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        todayAppointments,
        getCustomerById,
        getCustomerAppointments,
        getCustomerServiceRecords,
        getVehicleById,
        getTodaySummary,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export { customers };
