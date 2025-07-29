export function getAppUrl (path: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${appUrl}/${path}`
}