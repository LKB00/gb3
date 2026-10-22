// Daily reminder: builds a small calendar file (.ics) that repeats every day,
// so people can add "Play GB3" to their own calendar. No account, no push, no server.
// The time is "floating" (no Z, no time zone), so it rings at that local time wherever you are.

export const SITE_URL = 'https://gb3.lokeshbhatia.com/';

const pad = (n) => String(n).padStart(2, '0');
const stamp = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
const utcStamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');

// "HH:MM" from a time input; anything else falls back to 09:00.
export function cleanTime(t) {
  const m = /^(\d{1,2}):(\d{2})/.exec(String(t || ''));
  const h = m ? Number(m[1]) : 9;
  const min = m ? Number(m[2]) : 0;
  return h < 24 && min < 60 ? `${pad(h)}:${pad(min)}` : '09:00';
}

export function reminderIcs(time = '09:00', now = new Date()) {
  const [h, min] = cleanTime(time).split(':').map(Number);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, min);
  const end = new Date(start.getTime() + 10 * 60 * 1000);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GB3//Daily reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:gb3-daily-${now.getTime()}@gb3.lokeshbhatia.com`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    'RRULE:FREQ=DAILY',
    'SUMMARY:Play GB3 · 2 minutes',
    `DESCRIPTION:A few quick rounds of Good Bot\\, Bad Bot. ${SITE_URL}`,
    `URL:${SITE_URL}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Play GB3 · 2 minutes',
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}

// Starts the download. Returns false when the browser can't (then show a short note).
export function downloadReminder(time) {
  try {
    const a = document.createElement('a');
    if (!('download' in a) || !window.URL?.createObjectURL) return false;
    const url = URL.createObjectURL(new Blob([reminderIcs(time)], { type: 'text/calendar;charset=utf-8' }));
    a.href = url;
    a.download = 'gb3-reminder.ics';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return true;
  } catch {
    return false;
  }
}
