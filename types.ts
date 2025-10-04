export enum View {
  Dashboard = 'dashboard',
  Admin = 'admin',
  Collector = 'collector',
}

export enum Role {
  Admin = 'admin',
  Collector = 'collector',
}

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this should not be stored in plaintext
  role: Role;
}

export type CollectionStatus = 'Pending' | 'Collected';

export interface Household {
  id: string;
  houseNumber: string;
  address: string;
  ownerName: string;
  block: string;
  panchayat: string;
  status: CollectionStatus;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface CollectionRecord {
  id?: string;
  householdId: string;
  collectorId: string;
  timestamp: Date;
  location: LocationCoords | null;
}

export interface AreaLocation {
  id: string;
  blockName: string;
  panchayats: string[];
}

export interface PendingDate {
  id: string;
  householdId: string;
  date: string; // YYYY-MM-DD format
  reason?: string;
  createdAt: Date;
}
