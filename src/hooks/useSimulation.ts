import { useCallback, useEffect, useState } from 'react';

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
 * subscribe to the topic
 * publish SUBSCRIBE or UNSUBSCRIBE to the topic
 */

export const SIMULATION_SOCKET_URL = 'ws://localhost:8080/simulation-socket';
export const SIMULATION_DATA_TOPIC = '/topic/simulation-data';

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
const subscriptions: Record<string, StompSubscription> = {};
type ErrorType = {
  name: 'WEBSOCKET_ERROR' | 'STOMP_ERROR' | 'MAX_RETRIES_REACHED';
  message: string;
};
const MAX_RECONNECT_TRIES = 5;

export function useSimulation(config: StompConfig, callback?: () => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<ErrorType | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const connect = useCallback(() => {
    if (!stompClient) {
      stompClient = new Client(config);
      stompClient.activate();
    }

    stompClient.onConnect = () => {
      setIsConnected(true);
      setReconnectAttempts(0);
      callback?.();
    };

    stompClient.onDisconnect = () => {
      setIsConnected(false);

      if (reconnectAttempts < MAX_RECONNECT_TRIES) {
        setTimeout(() => {
          setReconnectAttempts(c => c + 1);
          connect();
        }, 1000);
      } else {
        setError({
          name: 'MAX_RETRIES_REACHED',
          message: 'Maximum reconnect attmepts reached.',
        });
      }
    };

    stompClient.onStompError = frame => {
      setError({
        name: 'STOMP_ERROR',
        message: frame.headers.message,
      });
    };

    stompClient.onWebSocketError = event => {
      setError({
        name: 'WEBSOCKET_ERROR',
        message:
          event.message || 'Cannot connect to the websocket. Please try again.',
      });
    };

    // uncomment this block of code to see the debug messages for the websocket
    // stompClient.debug = (msg) => {
    //   console.warn(msg);
    // };
  }, [callback, config, reconnectAttempts]);

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
    [],
  );

  const subscribe = useCallback(
    // TODO: make the message type more specific, make it the same as in the server
    (path: string, callback: (msg: string) => void) => {
      if (!stompClient) {
        return;
      }

      if (subscriptions[path]) {
        return;
      }

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
  }, []);

  useEffect(connect, [connect]);

  return {
    connect,
    deactivate,
    error,
    isConnected,
    publish,
    subscribe,
    subscriptions,
    unsubscribe,
  };
}
