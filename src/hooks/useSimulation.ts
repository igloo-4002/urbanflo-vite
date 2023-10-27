import { useCallback, useEffect, useState } from 'react';

import {
  Client,
  StompConfig,
  StompHeaders,
  StompSubscription,
} from '@stomp/stompjs';

/**
 * Hook to connect, subscribe, publish, and manage WebSocket communications via STOMP protocol.
 *
 * @param {StompConfig} config - Configuration object for the STOMP client.
 * @param {() => void} [callback] - Optional callback function to be called when connection is established.
 * @returns {object} - Contains utility methods to manage WebSocket communication and connection state.
 */

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

  /**
   * Initiates the connection to the WebSocket using the provided configuration.
   */
  const connect = useCallback(() => {
    if (!stompClient) {
      stompClient = new Client(config);

      stompClient.onConnect = () => {
        setIsConnected(true);
        setReconnectAttempts(0);
        if (error) {
          setError(null);
        }
        callback?.();
      };

      stompClient.activate();
    }

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
    // stompClient.debug = msg => {
    //   console.warn(msg);
    // };
  }, [callback, config, reconnectAttempts]);

  /**
   * Publishes a message to the specified path on the WebSocket.
   *
   * @param {string} path - The destination path to publish the message.
   * @param {{ status: 'START' | 'STOP' }} body - The message body to publish.
   * @param {StompHeaders} [headers] - Optional headers to include with the message.
   */
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

  /**
   * Subscribes to messages from a specified path on the WebSocket.
   *
   * @param {string} path - The destination path to subscribe to.
   * @param {(msg: string) => void} callback - Callback function to handle incoming messages.
   */
  const subscribe = useCallback(
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

  /**
   * Unsubscribes from messages from a specified path on the WebSocket.
   *
   * @param {string} path - The destination path to unsubscribe from.
   */
  const unsubscribe = useCallback((path: string) => {
    subscriptions[path].unsubscribe();
    delete subscriptions[path];
  }, []);

  /**
   * Deactivates the STOMP client, terminating the WebSocket connection.
   */
  const deactivate = useCallback(() => {
    stompClient.deactivate();
  }, []);

  useEffect(connect, []);

  return {
    connect,
    deactivate,
    error,
    isConnected,
    publish,
    subscribe,
    subscriptions,
    unsubscribe,
  } as const;
}
