export interface MediaWithUsages {
  id: number
  alt: string
  url: string | null
  thumbnailUrl: string | null
  filename: string | null
  mimeType: string | null
  filesize: string | null
  width: string | null
  height: string | null
  createdAt: Date | string | null
  updatedAt: Date | string | null
  usedIn: {
    portfolios: { id: number; title: string }[]
    services: { id: number; title: string }[]
  }
}
