export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  plan: "free" | "premium" | "family" | "business";
  createdAt: string;
}

export interface SavedFlight {
  id: string;
  userId: string;
  flightNumber: string;
  departureCode: string;
  arrivalCode: string;
  date: string;
  createdAt: string;
}

export interface TrackedRoute {
  id: string;
  userId: string;
  departureCode: string;
  arrivalCode: string;
  notifyDelays: boolean;
  createdAt: string;
}
