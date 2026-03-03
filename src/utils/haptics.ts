export function haptic(pattern: number | number[] = 8) {
  navigator.vibrate?.(pattern)
}
