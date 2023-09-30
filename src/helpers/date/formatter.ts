import { isValid, parseISO } from 'date-fns';
import { format as formatTz, utcToZonedTime } from 'date-fns-tz';

export function formatISOString(dateString: string) {
  const date = parseISO(dateString);

  if (!isValid(date)) {
    throw new Error('Invalid date string');
  }

  const utcDate = utcToZonedTime(date, 'Etc/UTC');

  const formattedDate = formatTz(utcDate, 'dd/MM/yy', { timeZone: 'Etc/UTC' });
  const formattedTime = formatTz(utcDate, 'h:mm aa', { timeZone: 'Etc/UTC' });

  return {
    date: formattedDate,
    time: formattedTime,
  };
}
