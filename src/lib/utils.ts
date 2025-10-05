import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format credits with Imperial symbol and proper number formatting
 * Uses ⬟ (Imperial Credit symbol) instead of dollar sign
 */
export function formatCredits(amount: number): string {
  return `⬟${amount.toLocaleString()}`
}
