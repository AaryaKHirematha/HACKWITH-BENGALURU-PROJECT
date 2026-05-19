/**
 * Formatting Utilities
 * Enterprise-grade formatters for dates, numbers, and threat data
 */

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import type { ThreatSeverity } from '@/types';

// ============================================================
// DATE FORMATTING
// ============================================================

/**
 * Formats ISO date string to localized format
 * @param date - ISO date string or Date object
 * @param formatStr - Format pattern
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  formatStr: string = 'MMM dd, yyyy HH:mm:ss'
): string {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return 'Invalid date';
  return format(parsed, formatStr);
}

/**
 * Returns human-readable relative time
 * @param date - ISO date string or Date object
 * @returns Relative time string (e.g., "5 minutes ago")
 */
export function timeAgo(date: string | Date): string {
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return 'Unknown';
  return formatDistanceToNow(parsed, { addSuffix: true });
}

/**
 * Formats ISO date for API requests
 * @param date - Date object
 * @returns ISO 8601 formatted string
 */
export function toISOString(date: Date): string {
  return date.toISOString();
}

// ============================================================
// NUMBER FORMATTING
// ============================================================

/**
 * Formats large numbers with abbreviations
 * @param num - Number to format
 * @returns Formatted string (e.g., "1.2K", "3.4M")
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Formats percentage with specified decimal places
 * @param value - Percentage value (0-100)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats bytes to human-readable size
 * @param bytes - Number of bytes
 * @returns Formatted size string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// ============================================================
// THREAT-SPECIFIC FORMATTERS
// ============================================================

/**
 * Severity level to display label mapping
 */
export const severityLabels: Record<ThreatSeverity, string> = {
  critical: 'CRITICAL',
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
  info: 'INFO'
};

/**
 * Severity level to color mapping for UI
 */
export const severityColors: Record<ThreatSeverity, string> = {
  critical: 'text-red-500',
  high: 'text-orange-500',
  medium: 'text-yellow-500',
  low: 'text-blue-500',
  info: 'text-slate-400'
};

/**
 * Severity level to background color mapping
 */
export const severityBgColors: Record<ThreatSeverity, string> = {
  critical: 'bg-red-500/20',
  high: 'bg-orange-500/20',
  medium: 'bg-yellow-500/20',
  low: 'bg-blue-500/20',
  info: 'bg-slate-500/20'
};

/**
 * Formats threat confidence score
 * @param score - Confidence score (0-100)
 * @returns Formatted confidence with label
 */
export function formatConfidence(score: number): string {
  if (score >= 90) return `${score}% - Very High`;
  if (score >= 70) return `${score}% - High`;
  if (score >= 50) return `${score}% - Medium`;
  if (score >= 30) return `${score}% - Low`;
  return `${score}% - Very Low`;
}

/**
 * Truncates text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Capitalizes first letter of each word
 * @param str - Input string
 * @returns Capitalized string
 */
export function toTitleCase(str: string): string {
  return str
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
