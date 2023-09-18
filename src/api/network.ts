import { BASE_URL } from '~/simulation-urls';
import { Connection, Edge, Flow, Node, Route, VType } from '~/types/Network';
import { SimulationInfo, SimulationOutput } from '~/types/Simulation';

type NetworkPayload = {
  documentName: string;
  nodes: Node[];
  edges: Edge[];
  connections: Connection[];
  route: Route[];
  flow: Flow[];
  vType: VType[];
};

export async function uploadNetwork(
  network: NetworkPayload,
): Promise<SimulationInfo> {
  const response = await fetch(`${BASE_URL}/simulation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(network),
  });

  if (!response.ok) {
    throw new Error(`Failed to upload network: ${response.statusText}`);
  }

  return await response.json();
}

export async function getSimulationOutput(
  simulationId: string,
): Promise<SimulationOutput> {
  const response = await fetch(
    `${BASE_URL}/simulation/${simulationId}/output`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to get network output: ${response.statusText}`);
  }

  return await response.json();
}

export async function getSimulationAnalytics(
  simulationAnalytics: SimulationOutput,
): Promise<number[]> {
  const tripInfo = simulationAnalytics.tripInfo;
  const netState = simulationAnalytics.netstate;
// Run time: Measured in simulation seconds

// Average duration: The average time each vehicle needed to accomplish the route in simulation seconds
  // Extract all durations into an array
  const durations = tripInfo.map((trip) => trip.duration);

  // Calculate the average duration
  const totalDuration = durations.reduce((acc, duration) => acc + duration, 0);
  const averageDuration = totalDuration / tripInfo.length;

// Waiting time: The average time in which vehicles speed was below or equal 0.1 m/s in simulation seconds
  // Extract all durations into an array
  const waitingTime = tripInfo.map((trip) => trip.waitingTime);

  // Calculate the average duration
  const totalWaiting = waitingTime.reduce((acc, time) => acc + time, 0);
  const averageWaiting = totalWaiting / tripInfo.length;

// Time loss: The time lost due to driving below the ideal speed. (ideal speed includes the individual speedFactor; slowdowns due to intersections etc. will incur timeLoss, scheduled stops do not count) in simulation seconds
// Extract all durations into an array
const timeLoss = tripInfo.map((trip) => trip.timeLoss);

// Calculate the average duration
const totalTimeLoss = timeLoss.reduce((acc, time) => acc + time, 0);
const averageTimeLoss = totalTimeLoss / tripInfo.length;


// Total number of cars that reached their destination. Can work this out with vaporised variable
const noFinish = tripInfo.filter((trip) => trip.vaporized === true).length;
const totalNumberOfCarsThatCompleted = tripInfo.length - noFinish;


// Return the averages as an array
  return [averageDuration, averageWaiting, averageTimeLoss, totalNumberOfCarsThatCompleted];
}

export async function getSimulationInfo(
  simulationId: string,
): Promise<SimulationInfo> {
  const response = await fetch(`${BASE_URL}/simulation/${simulationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get network output: ${response.statusText}`);
  }

  return await response.json();
}

export async function modifyNetwork(
  simulationId: string,
  network: NetworkPayload,
): Promise<SimulationInfo> {
  const response = await fetch(`${BASE_URL}/simulation/${simulationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(network),
  });

  if (!response.ok) {
    throw new Error(`Failed to modify network: ${response.statusText}`);
  }

  return await response.json();
}

export async function deleteSimulation(simulationId: string) {
  const response = await fetch(`${BASE_URL}/simulation/${simulationId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete simulation: ${response.statusText}`);
  }

  return await response.json();
}

export async function getAllSimulationInfo(): Promise<SimulationInfo[]> {
  const response = await fetch(`${BASE_URL}/simulations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get simulation info: ${response.statusText}`);
  }

  return await response.json();
}
