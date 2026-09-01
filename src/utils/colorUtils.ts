import { ColorOption } from '../types';

/**
 * Generates a random 6-character hex color code (e.g. #4A90E2)
 */
export function generateRandomHex(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color.toUpperCase();
}

/**
 * Converts a hex code to { r, g, b } integer values (0-255)
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return { r, g, b };
}

/**
 * Determines whether text on top of this color should be dark or light
 */
export function getContrastTextColor(hex: string): 'text-white' | 'text-zinc-950' {
  const { r, g, b } = hexToRgb(hex);
  // Standard perceptual luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? 'text-zinc-950' : 'text-white';
}

/**
 * Returns detailed breakdown of the HEX components (R, G, B in hex and decimal 0-255)
 */
export function getHexBreakdown(hex: string) {
  const clean = hex.replace('#', '').toUpperCase().padEnd(6, '0');
  const rHex = clean.substring(0, 2);
  const gHex = clean.substring(2, 4);
  const bHex = clean.substring(4, 6);
  const rVal = parseInt(rHex, 16);
  const gVal = parseInt(gHex, 16);
  const bVal = parseInt(bHex, 16);

  return {
    rHex,
    gHex,
    bHex,
    rVal,
    gVal,
    bVal,
    rPercent: Math.round((rVal / 255) * 100),
    gPercent: Math.round((gVal / 255) * 100),
    bPercent: Math.round((bVal / 255) * 100),
  };
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Calculates Euclidean color distance between two RGB colors (0 to ~441)
 */
export function getColorDistance(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const dr = rgb1.r - rgb2.r;
  const dg = rgb1.g - rgb2.g;
  const db = rgb1.b - rgb2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Generates 6 color options: 1 target and 5 distinctly different distractor colors.
 * Ensures minimum Euclidean color distance so players can discern colors clearly.
 */
export function generateColorRound(): { targetHex: string; options: ColorOption[] } {
  const targetHex = generateRandomHex();
  const selectedColors: string[] = [targetHex];

  const MIN_DISTANCE_FROM_TARGET = 95; // Clear distinction from target color
  const MIN_DISTANCE_BETWEEN_OPTIONS = 70; // Distinct from other distractors

  let attempts = 0;
  while (selectedColors.length < 6 && attempts < 200) {
    attempts++;
    const candidateHex = generateRandomHex();

    // Check distance to target color
    const distToTarget = getColorDistance(candidateHex, targetHex);
    if (distToTarget < MIN_DISTANCE_FROM_TARGET) {
      continue;
    }

    // Check distance to all other picked distractors
    const isFarEnoughFromAll = selectedColors.every(
      (c) => getColorDistance(candidateHex, c) >= MIN_DISTANCE_BETWEEN_OPTIONS
    );

    if (isFarEnoughFromAll) {
      selectedColors.push(candidateHex);
    }
  }

  // Fallback if strict distance took too many iterations
  while (selectedColors.length < 6) {
    const randomHex = generateRandomHex();
    if (!selectedColors.includes(randomHex)) {
      selectedColors.push(randomHex);
    }
  }

  const options: ColorOption[] = selectedColors.map((hex, index) => ({
    id: `opt-${index}-${hex}`,
    hex,
    isTarget: hex === targetHex,
  }));

  return {
    targetHex,
    options: shuffleArray(options),
  };
}

function clampAndToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (val: number) => clamp(val).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
