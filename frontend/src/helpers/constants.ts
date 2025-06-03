export const CACHE_SIZE = 3;

export const SVG_CONSTANTS = {
  RECTANGLE_SIZE: 40,
  ARROW_WIDTH: 30,
  CONNECTOR_SIZE: 3,
  TOP_CONNECTOR_Y: 10,
  BOTTOM_CONNECTOR_Y: 30,
  ANCHOR_BUFFER: 10,
};

export const COLORS = {
  STROKE: "#475569",
  RECTANGLE_BG: "#f8fafc",
  RECTANGLE_SHADOW: "rgba(0, 0, 0, 0.1)",
  CONNECTOR_BG: "#475569",
  FREQUENCY_BADGE_BG: "#4B5563",
  FREQUENCY_BADGE_TEXT: "#FFFFFF",
  FREQUENCY_LOW: "#10B981", // Green for low frequency (1-2)
  FREQUENCY_MEDIUM: "#F59E0B", // Amber for medium frequency (3-5)
  FREQUENCY_HIGH: "#EF4444", // Red for high frequency (6+)
};

// Helper function to get color based on frequency - can be imported and used across components
export const getFrequencyColor = (freq: number) => {
  if (freq <= 2) return COLORS.FREQUENCY_LOW;
  if (freq <= 5) return COLORS.FREQUENCY_MEDIUM;
  return COLORS.FREQUENCY_HIGH;
};