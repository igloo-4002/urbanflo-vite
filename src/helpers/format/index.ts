import { isValid, parseISO } from 'date-fns';
import { format as formatTz, utcToZonedTime } from 'date-fns-tz';

import { IntersectionType } from '~/types/Network';

export function formatISOString(dateString: string, timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone) {
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

export function prettyPrintIntersectionType(type: IntersectionType) {
  // Replace underscores with spaces and capitalize the first letter
  return type.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
}
