/**
 * Utility to format dates and times explicitly into Indian Standard Time (IST, UTC+5:30)
 */

export function formatIST(dateInput, options = {}) {
  if (!dateInput) return 'N/A';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);

    const defaultOptions = {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      ...options
    };

    const formatted = new Intl.DateTimeFormat('en-IN', defaultOptions).format(d);
    return `${formatted} IST`;
  } catch (e) {
    return `${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`;
  }
}

export function formatISTTimeOnly(dateInput) {
  return formatIST(dateInput, { day: undefined, month: undefined, year: undefined });
}

export function getCurrentISTString() {
  return formatIST(new Date());
}
