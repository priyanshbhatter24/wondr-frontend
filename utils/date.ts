/**
 * Format an ISO date string to a relative time string
 * @param isoDate - ISO 8601 date string
 * @returns Relative time string (e.g., "2 hours ago", "just now")
 */
export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  return date.toLocaleDateString();
}

/**
 * Get source label from channels object
 * @param channels - Channels object with channel names as keys
 * @returns Comma-separated list of channel names (e.g., "Reddit, X, BBC")
 */
export function getChannelSourcesLabel(channels: { [key: string]: any[] }): string {
  return Object.keys(channels).filter((key) => channels[key].length > 0).join(", ");
}
