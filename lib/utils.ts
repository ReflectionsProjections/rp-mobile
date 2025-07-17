export function getWeekday(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase() || '';
}