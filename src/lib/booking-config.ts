export const BOOKING_WINDOW_DAYS = 21;
export const MIN_BOOKING_NAME_LENGTH = 2;
export const MIN_BOOKING_PHONE_LENGTH = 7;
export const MAX_BOOKING_NOTES_LENGTH = 500;

const weekdayHours = {
  openHour: 9,
  closeHour: 18,
} as const;

export function getOperatingHours(dayOfWeek: number) {
  if (dayOfWeek === 0) {
    return null;
  }

  if (dayOfWeek === 6) {
    return {
      openHour: 9,
      closeHour: 15,
    };
  }

  return weekdayHours;
}
