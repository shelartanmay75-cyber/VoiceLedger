/**
 * Helper to convert any date string input into ISO YYYY-MM-DD string
 */
export function toISODateString(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];

  const lower = dateStr.toLowerCase().trim();
  const today = new Date();

  if (lower === 'today') {
    return today.toISOString().split('T')[0];
  }

  if (lower === 'yesterday') {
    const yest = new Date(today);
    yest.setDate(today.getDate() - 1);
    return yest.toISOString().split('T')[0];
  }

  // Handle strings like "29 Jul", "29th July 2026", "2026-07-29"
  const cleanStr = dateStr.replace(/(\d+)(st|nd|rd|th)/i, '$1');
  let parsed = new Date(cleanStr);

  if (isNaN(parsed.getTime())) {
    parsed = new Date(`${cleanStr} ${today.getFullYear()}`);
  }

  if (!isNaN(parsed.getTime())) {
    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, '0');
    const dd = String(parsed.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  return today.toISOString().split('T')[0];
}

/**
 * Helper to format ISO date string into standard "29 Jul 2026" text format
 */
export function formatDateToStandard(isoDateOrStr: string): string {
  const iso = toISODateString(isoDateOrStr);
  const parsed = new Date(iso + 'T00:00:00');
  if (isNaN(parsed.getTime())) return isoDateOrStr;

  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Dynamically compute relative display date ("Today", "Yesterday", or "29 Jul 2026")
 * relative to the current local date.
 */
export function formatExpenseDisplayDate(isoDate?: string, fallbackDate?: string): string {
  const targetIso = isoDate ? toISODateString(isoDate) : (fallbackDate ? toISODateString(fallbackDate) : '');

  if (!targetIso) return fallbackDate || 'Today';

  const today = new Date();
  const todayIso = today.toISOString().split('T')[0];

  const yest = new Date(today);
  yest.setDate(today.getDate() - 1);
  const yestIso = yest.toISOString().split('T')[0];

  if (targetIso === todayIso) {
    return 'Today';
  }

  if (targetIso === yestIso) {
    return 'Yesterday';
  }

  // Check if string stored in fallbackDate is already a clean date string
  if (fallbackDate && fallbackDate.toLowerCase() !== 'today' && fallbackDate.toLowerCase() !== 'yesterday') {
    return fallbackDate;
  }

  return formatDateToStandard(targetIso);
}
