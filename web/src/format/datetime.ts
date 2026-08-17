const dateTime = new Intl.DateTimeFormat('en-US', {
  // dinero!
  month: 'short',
  day: '2-digit',
  hour: 'numeric',
  minute: '2-digit',
});

export function when(iso: string): string {
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? iso : dateTime.format(parsed);
}
