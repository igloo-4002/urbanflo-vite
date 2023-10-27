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

/**
 * Uploads a network payload to initiate a simulation.
 * @param {NetworkPayload} network - The network payload containing various network elements.
 * @returns {Promise<SimulationInfo>} The response with simulation details.
 * @throws {Error} Throws an error if the upload fails.
 */
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

/**
 * Fetches the output of a specific simulation.
 * @param {string} simulationId - The ID of the simulation.
 * @returns {Promise<SimulationOutput>} The simulation output details.
 * @throws {Error} Throws an error if fetching the output fails.
 */
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

/**
 * Fetches the output statistics of a specific simulation.
 * @param {string} simulationId - The ID of the simulation.
 * @returns {Promise<SimulationStatistics>} The simulation output statistics.
 * @throws {Error} Throws an error if fetching the statistics fails.
 */
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

/**
 * Fetches the analytics of a specific simulation.
 * @param {string} simulationId - The ID of the simulation.
 * @returns {Promise<SimulationAnalytics>} The simulation analytics details.
 * @throws {Error} Throws an error if fetching the analytics fails.
 */
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

/**
 * Fetches information of a specific simulation.
 * @param {string} simulationId - The ID of the simulation.
 * @returns {Promise<SimulationInfo>} The simulation information.
 * @throws {Error} Throws an error if fetching the information fails.
 */
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

/**
 * Modifies a specific simulation with a new network payload.
 * @param {string} simulationId - The ID of the simulation.
 * @param {NetworkPayload} network - The new network payload.
 * @returns {Promise<SimulationInfo>} The updated simulation details.
 * @throws {Error} Throws an error if the modification fails.
 */
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

/**
 * Deletes a specific simulation.
 * @param {string} simulationId - The ID of the simulation.
 * @throws {Error} Throws an error if the deletion fails.
 */
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

/**
 * Fetches information of all simulations.
 * @returns {Promise<SimulationInfo[]>} A list of all simulation details.
 * @throws {Error} Throws an error if fetching the information fails.
 */
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
