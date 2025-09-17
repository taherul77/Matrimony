/**
 * Utility functions for the matrimonial application
 */

/**
 * Generate a unique key for React components to prevent duplicate key warnings
 * @param prefix - A prefix to identify the component type
 * @param id - Primary identifier (could be database ID)
 * @param index - Array index as fallback
 * @param additionalData - Optional additional data for uniqueness
 * @returns A unique string key
 */
export function generateUniqueKey(
  prefix: string,
  id?: string | number,
  index?: number,
  additionalData?: string | number
): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  
  let key = prefix;
  
  if (id) {
    key += `-${id}`;
  }
  
  if (index !== undefined) {
    key += `-idx${index}`;
  }
  
  if (additionalData) {
    key += `-${additionalData}`;
  }
  
  key += `-${timestamp}-${randomSuffix}`;
  
  return key;
}

/**
 * Safely format a date/time string to prevent hydration mismatches
 * @param timestamp - ISO timestamp string
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted time string or empty string if not client-side
 */
export function safeFormatTime(
  timestamp: string,
  options: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit' 
  }
): string {
  // Only format on client-side to prevent hydration mismatch
  if (typeof window === 'undefined') {
    return '';
  }
  
  try {
    return new Date(timestamp).toLocaleTimeString([], options);
  } catch (error) {
    console.warn('Error formatting time:', error);
    return '';
  }
}

/**
 * Check if we're running on the client side
 * @returns boolean indicating if running in browser
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Debounce function to limit how often a function can be called
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate a chat room ID from two user IDs
 * @param userId1 - First user ID
 * @param userId2 - Second user ID
 * @returns Consistent chat room ID regardless of parameter order
 */
export function generateChatRoomId(userId1: string, userId2: string): string {
  const sortedIds = [userId1, userId2].sort();
  return `chat_${sortedIds[0]}_${sortedIds[1]}`;
}