export function haptic(pattern: number | number[] = 8) {
  // navigator.vibrate is not available in all browsers
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  navigator.vibrate?.(pattern);
}
