type ClassValue = string | false | null | undefined

/** Склеивает классы, пропуская пустые: cn(s.btn, isGhost && s.ghost) */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
