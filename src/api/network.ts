import { BASE_URL } from '~/simulation-urls';
import { Connection, Edge, Flow, Node, Route, VType } from '~/types/Network';
import {
  SimulationAnalytics,
  SimulationInfo,
  SimulationOutput,
  SimulationStatistics,
} from '~/types/Simulation';

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

export async function getSimulationOutputStatistics(
  simulationId: string,
): Promise<SimulationStatistics> {
  const response = await fetch(
    `${BASE_URL}/simulation/${simulationId}/output/statistics`,
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
  simulationId: string,
): Promise<SimulationAnalytics> {
  const response = await fetch(
    `${BASE_URL}/simulation/${simulationId}/analytics`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to get simulation analytics: ${response.statusText}`,
    );
  }

  return await response.json();
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
