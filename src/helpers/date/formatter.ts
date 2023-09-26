import { DateTime } from 'luxon';

export function formatISOString(dateString: string) {
  const date = DateTime.fromISO(dateString, { zone: 'UTC' });
  if (!date.isValid) {
    throw new Error('Invalid date string');
  }

  const day = String(date.day).padStart(2, '0');
  const month = String(date.month).padStart(2, '0');
  const year = String(date.year).slice(-2);
  const time = date.toLocaleString(DateTime.TIME_SIMPLE).normalize();

  return {
    date: `${day}/${month}/${year}`,
    time,
  };
}
