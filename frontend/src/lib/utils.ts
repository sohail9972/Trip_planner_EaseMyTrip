import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatCurrency(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
    .trim()
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/
  return base64Regex.test(imageData)
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateId(prefix: string = '') {
  return `${prefix}${Math.random().toString(36).substr(2, 9)}`
}

export function parseJsonSafely<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    return defaultValue
  }
}

export function isObjectEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0
}

export function getQueryParam(url: string, param: string): string | null {
  const urlObj = new URL(url, window.location.origin)
  return urlObj.searchParams.get(param)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
