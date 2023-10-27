import { isValid, parseISO } from 'date-fns';
import { format as formatTz, utcToZonedTime } from 'date-fns-tz';

import { IntersectionType } from '~/types/Network';

/**
 * Formats an ISO date string to a local date and time.
 * @param {string} dateString - The ISO date string to format.
 * @param {string} [timeZone=Intl.DateTimeFormat().resolvedOptions().timeZone] - The timezone to format the date to.
 * @returns {Object} An object containing the formatted date and time.
 * @throws {Error} Throws an error if the date string is invalid.
 */
export function formatISOString(
  dateString: string,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
) {
  const date = parseISO(dateString);

  if (!isValid(date)) {
    throw new Error('Invalid date string');
  }

  const localDate = utcToZonedTime(date, timeZone);

  const formattedDate = formatTz(localDate, 'dd/MM/yy', { timeZone: timeZone });
  const formattedTime = formatTz(localDate, 'h:mm aa', { timeZone: timeZone });

  return {
    date: formattedDate,
    time: formattedTime,
  };
}

/**
 * Formats simulation time given in milliseconds to a MM:SS:MS format.
 * @param {number} milliseconds - The number of milliseconds to format.
 * @returns {string} The formatted time in MM:SS:MS format.
 */
export function formatSimulationTime(milliseconds: number) {
  const remainingMilliseconds = Math.floor(milliseconds / 10) % 100;
  const totalSeconds = Math.floor(milliseconds / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0',
  )}:${String(remainingMilliseconds).padStart(2, '0')}`;
}

/**
 * Converts an intersection type enum to a human-readable string.
 * @param {IntersectionType} type - The intersection type to convert.
 * @returns {string} A human-readable string representation of the intersection type.
 */
export function prettyPrintIntersectionType(type: IntersectionType) {
  // Replace underscores with spaces and capitalize the first letter
  return type.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
}
