export type AppointmentStatus =
  | "bekliyor"
  | "geldi"
  | "tamamlandi"
  | "iptal";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  vehicles: Vehicle[];
}

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
}

export interface Appointment {
  id: string;
  customerId: string;
  vehicleId: string;
  operation: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface ServiceRecord {
  id: string;
  customerId: string;
  vehicleId: string;
  date: string;
  operation: string;
  mileage?: number;
  notes?: string;
}
