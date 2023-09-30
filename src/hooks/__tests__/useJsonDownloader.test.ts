/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';

import useJsonDownloader from '../useJsonDownloader';

describe('useJsonDownloader', () => {
  beforeAll(() => {
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should download json correctly', () => {
    const { result } = renderHook(() => useJsonDownloader());

    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation();
    const removeSpy = jest
      .spyOn(HTMLAnchorElement.prototype, 'remove')
      .mockImplementation();

    const dummyJson = JSON.stringify({ key: 'value' });
    const dummyFileName = 'test.json';
    result.current(dummyJson, dummyFileName);

    expect(global.URL.createObjectURL).toHaveBeenCalled();

    const addedAnchor = appendChildSpy.mock.calls[0][0] as HTMLAnchorElement;
    expect(addedAnchor).toBeInstanceOf(HTMLAnchorElement);
    expect(addedAnchor.download).toBe(dummyFileName);
    expect(addedAnchor.href).toBeTruthy();

    expect(clickSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();

    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('should create a Blob with correct parameters', () => {
    const { result } = renderHook(() => useJsonDownloader());

    const dummyJson = JSON.stringify({ key: 'value' });
    const dummyFileName = 'test.json';
    result.current(dummyJson, dummyFileName);

    const blob = (global.URL.createObjectURL as jest.Mock).mock.calls[0][0];
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/json');
  });

  it('should set the correct download attribute on the link', () => {
    const { result } = renderHook(() => useJsonDownloader());

    const createElementSpy = jest.spyOn(document, 'createElement');

    const dummyJson = JSON.stringify({ key: 'value' });
    const dummyFileName = 'test.json';
    result.current(dummyJson, dummyFileName);

    expect(createElementSpy).toHaveBeenCalledWith('a');

    const addedAnchor = createElementSpy.mock.results[0]
      .value as HTMLAnchorElement;
    expect(addedAnchor.download).toBe(dummyFileName);

    createElementSpy.mockRestore();
  });

  it('should handle an empty JSON string correctly', () => {
    const { result } = renderHook(() => useJsonDownloader());

    const createElementSpy = jest.spyOn(document, 'createElement');

    const dummyJson = '';
    const dummyFileName = 'empty.json';
    result.current(dummyJson, dummyFileName);

    expect(createElementSpy).toHaveBeenCalledWith('a');

    const addedAnchor = createElementSpy.mock.results[0]
      .value as HTMLAnchorElement;
    expect(addedAnchor.download).toBe(dummyFileName);

    createElementSpy.mockRestore();
  });

  it('should handle an empty filename correctly', () => {
    const { result } = renderHook(() => useJsonDownloader());

    const dummyJson = JSON.stringify({ key: 'value' });
    const dummyFileName = '';

    const createElementSpy = jest.spyOn(document, 'createElement');

    result.current(dummyJson, dummyFileName);

    const addedAnchor = createElementSpy.mock.results[0]
      .value as HTMLAnchorElement;
    expect(addedAnchor.download).toBe('');
    expect(addedAnchor.href).toBeTruthy();

    createElementSpy.mockRestore();
  });
});
