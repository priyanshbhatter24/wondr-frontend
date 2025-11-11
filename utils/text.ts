/**
 * Text utility functions for formatting and cleaning text content
 */

/**
 * Strips Twitter/X URLs (including their surrounding parentheses) from text
 * Removes patterns like: (https://twitter.com/...) and (https://x.com/...)
 *
 * @param text - The text to clean
 * @returns The text with Twitter URLs removed
 *
 * @example
 * stripTwitterUrls("Check this out (https://twitter.com/user/status/123)")
 * // Returns: "Check this out "
 */
export function stripTwitterUrls(text: string): string {
  if (!text) return text;

  // Match (https://twitter.com/...) or (https://x.com/...) including parentheses
  // Matches both http and https, twitter.com and x.com
  const twitterUrlPattern = /\(https?:\/\/(twitter\.com|x\.com)\/[^\s)]+\)/gi;

  return text.replace(twitterUrlPattern, '').trim();
}
