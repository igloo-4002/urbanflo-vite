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

export type SimulationAnalytics = {
  averageDuration: number;
  averageWaiting: number;
  averageTimeLoss: number;
  totalNumberOfCarsThatCompleted: number;
  simulationLength: number;
};

type Performance = {
  clockBegin: string;
  clockEnd: string;
  clockDuration: number;
  traciDuration: number;
  realTimeFactor: number;
  vehicleUpdatesPerSecond: number;
  personUpdatesPerSecond: number;
  begin: number;
  end: number;
  duration: number;
};

type Vehicles = {
  loaded: number;
  inserted: number;
  running: number;
  waiting: number;
};

type Teleports = {
  total: number;
  jam: number;
  yield: number;
  wrongLane: number;
};

type Safety = {
  collisions: number;
  emergencyStops: number;
  emergencyBraking: number;
};

type Persons = {
  loaded: number;
  running: number;
  jammed: number;
};

type PersonTeleports = {
  total: number;
  abortWait: number;
  wrongDest: number;
};

type VehicleTripStatistics = {
  count: number;
  routeLength: number;
  speed: number;
  duration: number;
  waitingTime: number;
  timeLoss: number;
  departDelay: number;
  departDelayWaiting: number;
  totalTravelTime: number;
  totalDepartDelay: number;
};

type PedestrianStatistics = {
  number: number;
  routeLength: number;
  duration: number;
  timeLoss: number;
};

type RideStatistics = {
  number: number;
};

type TransportStatistics = {
  number: number;
};

export type SimulationStatistics = {
  performance: Performance;
  vehicles: Vehicles;
  teleports: Teleports;
  safety: Safety;
  persons: Persons;
  personTeleports: PersonTeleports;
  vehicleTripStatistics: VehicleTripStatistics;
  pedestrianStatistics: PedestrianStatistics;
  rideStatistics: RideStatistics;
  transportStatistics: TransportStatistics;
};
