/**
 * Class Name Utility
 * Enterprise-grade class name merging using clsx and tailwind-merge
 * Handles conditional classes and Tailwind CSS class conflicts
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names with Tailwind CSS conflict resolution
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Creates variant-based class mappings
 * Useful for component variant systems
 */
export function cvm<T extends Record<string, string>>(
  base: string,
  variants: T,
  selected: keyof T
): string {
  return cn(base, variants[selected]);
}
