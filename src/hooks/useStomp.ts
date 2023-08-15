import { useCallback, useEffect } from 'react';

import {
  Client,
  StompConfig,
  StompHeaders,
  StompSubscription,
} from '@stomp/stompjs';

/**
 * USAGE
 *
 * connect to the socket URL by const {} = useStomp({ brokerURL: SIMULATION_SOCKET_URL })
 * subscribe to the simulation topic to receive updates while the simulation is running
 * subscribe to the simulation error topic to receive errors which might have occurred during the simulation
 * publish START or STOP to the topic
 */

// use to connect to web socket
export const SIMULATION_SOCKET_URL = 'ws://localhost:8080/simulation-socket';

// use to receive data from the server
export const SIMULATION_DATA_TOPIC = '/topic/simulation/demo';

// use to receive errors which might have happened during the simulation§
export const SIMULATION_ERROR_TOPIC = '/topic/simulation/demo/error';

// use to send a message to the server using the socket to start or stop the simulation
export const SIMULATION_DESTINATION_PATH = '/app/simulation/demo';

// the data returned from the server for each car
export type VehicleData = {
  id: string;
  position: [number, number]; // [x, y]
  color: string;
  acceleration: number;
  speed: number;
  lane: [number, string]; // [index, id]
};

let stompClient: Client;
let isConnected = false;
const subscriptions: { [key: string]: StompSubscription } = {};

export function useStomp(config: StompConfig, callback?: () => void) {
  const connect = useCallback(() => {
    if (!stompClient) {
      stompClient = new Client(config);
      stompClient.activate();
    }

    stompClient.onConnect = () => {
      isConnected = true;
      callback && callback();
    };

    // uncomment this block of code to see the debug messages for the websocket
    // stompClient.debug = (msg) => {
    //   console.warn(msg);
    // };
  }, []);

  const publish = useCallback(
    (
      path: string,
      body: { status: 'START' | 'STOP' },
      headers?: StompHeaders,
    ) => {
      stompClient.publish({
        destination: path,
        body: JSON.stringify(body),
        headers,
      });
    },
    [stompClient],
  );

  const subscribe = useCallback(
    // TODO: message type needs to looked at
    (path: string, callback: (msg: string) => void) => {
      if (!stompClient) return;

      if (subscriptions[path]) return;

      const subscription = stompClient.subscribe(path, message => {
        const body: string = message.body;
        callback(body);
      });
      subscriptions[path] = subscription;
    },
    [],
  );

  const unsubscribe = useCallback((path: string) => {
    subscriptions[path].unsubscribe();
    delete subscriptions[path];
  }, []);

  const deactivate = useCallback(() => {
    stompClient.deactivate();
  }, [stompClient]);

  useEffect(connect, []);

  return {
    connect,
    deactivate,
    subscribe,
    unsubscribe,
    subscriptions,
    isConnected,
    publish,
  };
}
