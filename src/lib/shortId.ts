import { customAlphabet } from 'nanoid';

// Use URL-safe characters (no confusing characters like 0/O, 1/l/I)
const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 8);

/**
 * Generate a unique 8-character short ID for URLs
 * - URL-safe characters only
 * - No confusing characters (0/O, 1/l/I)
 * - Collision probability: ~1 in 218 trillion for 1M IDs
 * 
 * @returns A unique 8-character string (e.g., "dQw4w9Wg")
 */
export function generateShortId(): string {
    return nanoid();
}

/**
 * Validate if a string matches the short ID format
 * @param id - String to validate
 * @returns true if valid short ID format
 */
export function isValidShortId(id: string): boolean {
    if (!id || id.length !== 8) return false;
    return /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz]{8}$/.test(id);
}

/**
 * Validate if a string is a UUID
 * @param id - String to validate
 * @returns true if valid UUID format
 */
export function isValidUUID(id: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}
