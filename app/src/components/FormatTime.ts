export function formatTime(timeString: string | Date | null | undefined): string {
  if (!timeString) return "-";

  const date = new Date(timeString);
  if (isNaN(date.getTime())) return "-"; // handle invalid date

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
