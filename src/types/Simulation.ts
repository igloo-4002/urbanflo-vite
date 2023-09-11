export type SimulationInfo = {
  id: string;
  documentName: string;
  createdAt: string;
  lastModifiedAt: string;
};

export type SumoTripInfo = {
  id: string;
  depart: number;
  departLane: string;
  departPos: number;
  departSpeed: number;
  departDelay: number;
  arrival: number;
  arrivalLane: string;
  arrivalPos: number;
  arrivalSpeed: number;
  duration: number;
  routeLength: number;
  waitingTime: number;
  waitingCount: number;
  stopTime: number;
  timeLoss: number;
  devices: string;
  vehicleType: string;
  speedFactor: number;
  vaporized?: boolean;
};

export type SumoNetstate = { time: number; edges: SumoNetstateEdge[] };

export type SumoNetstateEdge = { id: string; lanes: SumoNetstateLane[] };

export type SumoNetstateLane = { id: string; vehicles: SumoNetstateVehicle[] };

export type SumoNetstateVehicle = { id: string; pos: number; speed: number };

export type SimulationOutput = {
  tripInfo: SumoTripInfo[];
  netstate: SumoNetstate[];
};
