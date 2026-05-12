/**
 * Format large numbers for display
 * @param num - The number to format
 * @returns Formatted string (e.g., "125K", "1.5M")
 */
export function formatNumber(num: number | undefined | null): string {
    if (!num || num === 0) return '0';

    if (num >= 1000000) {
        const formatted = (num / 1000000).toFixed(1);
        return formatted.replace(/\.0$/, '') + 'M';
    }

    if (num >= 1000) {
        const formatted = (num / 1000).toFixed(1);
        return formatted.replace(/\.0$/, '') + 'K';
    }

    return num.toString();
}
