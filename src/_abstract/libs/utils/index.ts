import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export { COLOR_OPTIONS } from './projectColorOptions.ts'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
