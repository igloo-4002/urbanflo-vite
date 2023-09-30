/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';

import { useSimulation } from '../useSimulation';

const mockPublish = jest.fn();
const mockDeactivate = jest.fn();
const mockSubscribe = jest.fn((_, callback) => {
  callback({ body: 'mockBody' });
  return { unsubscribe: mockUnsubscribe };
});
const mockUnsubscribe = jest.fn();
const mockOnConnect = jest.fn();
const mockOnDisconnect = jest.fn();
const mockOnStompError = jest.fn();
const mockOnWebSocketError = jest.fn();

const mockConfig = { brokerURL: 'mockURL' };

jest.mock('@stomp/stompjs', () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        activate: function () {
          this.onConnect();
        },
        publish: mockPublish,
        subscribe: mockSubscribe,
        deactivate: mockDeactivate,
        onConnect: mockOnConnect,
        onDisconnect: mockOnDisconnect,
        onStompError: mockOnStompError,
        onWebSocketError: mockOnWebSocketError,
      };
    }),
  };
});

describe('useSimulation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should connect on initialisation', () => {
    const { result } = renderHook(() => useSimulation(mockConfig));

    expect(result.current.isConnected).toBeTruthy();
    expect(result.current.error).toBeNull();
  });

  it('should publish a message', () => {
    const { result } = renderHook(() => useSimulation(mockConfig));

    act(() => {
      result.current.publish('/mock/path', { status: 'START' });
    });

    expect(mockPublish).toBeCalledWith({
      destination: '/mock/path',
      body: JSON.stringify({ status: 'START' }),
      headers: undefined,
    });
  });

  it('should subscribe to a topic and call the provided callback', () => {
    const { result } = renderHook(() => useSimulation(mockConfig));

    const mockCallback = jest.fn();

    act(() => {
      result.current.subscribe('/mock/path', mockCallback);
    });

    expect(mockCallback).toHaveBeenCalledWith('mockBody');
  });

  it('should unsubscribe from a topic', () => {
    const { result } = renderHook(() => useSimulation(mockConfig));
    const mockCallback = jest.fn();

    act(() => {
      result.current.subscribe('/mock/path', mockCallback);
    });
  });

  it('should deactivate the client', () => {
    const { result } = renderHook(() => useSimulation(mockConfig));

    act(() => {
      result.current.deactivate();
    });

    expect(mockDeactivate).toHaveBeenCalledTimes(1);
  });

  it('should not subscribe to the same topic multiple times', () => {
    const { result } = renderHook(() => useSimulation(mockConfig));

    act(() => {
      result.current.subscribe('/mock/path', jest.fn());
      result.current.subscribe('/mock/path', jest.fn());
    });

    expect(mockSubscribe).toHaveBeenCalledTimes(1);
  });
});
