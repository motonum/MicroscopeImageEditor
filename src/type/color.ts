export const COLOR_OPTIONS = [
  "default",
  "red",
  "green",
  "blue",
  "yellow",
  "cyan",
  "magenta",
] as const;

export type ColorOption = (typeof COLOR_OPTIONS)[number];
