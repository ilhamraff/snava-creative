import {
  Briefcase,
  Camera,
  Code,
  Compass,
  FileText,
  Globe,
  Layers,
  Layout,
  Megaphone,
  Monitor,
  Palette,
  PenTool,
  Share2,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Video,
} from 'lucide-react'

export const ICON_OPTIONS = [
  { name: 'Palette', label: 'Desain / Branding', icon: Palette },
  { name: 'Megaphone', label: 'Media Sosial', icon: Megaphone },
  { name: 'PenTool', label: 'Logo / Ilustrasi', icon: PenTool },
  { name: 'Globe', label: 'Website / Web App', icon: Globe },
  { name: 'Camera', label: 'Fotografi', icon: Camera },
  { name: 'Video', label: 'Videografi', icon: Video },
  { name: 'FileText', label: 'Company Profile', icon: FileText },
  { name: 'Layers', label: 'Layanan Umum', icon: Layers },
  { name: 'Monitor', label: 'UI/UX Design', icon: Monitor },
  { name: 'Layout', label: 'Landing Page', icon: Layout },
  { name: 'Sparkles', label: 'Creative Magic', icon: Sparkles },
  { name: 'TrendingUp', label: 'Marketing', icon: TrendingUp },
  { name: 'Code', label: 'Development', icon: Code },
  { name: 'ShoppingBag', label: 'E-Commerce', icon: ShoppingBag },
  { name: 'Share2', label: 'Social Content', icon: Share2 },
  { name: 'Compass', label: 'Brand Strategy', icon: Compass },
  { name: 'Briefcase', label: 'Bisnis', icon: Briefcase },
]

export function renderServiceIcon(iconName?: string | null, className = 'h-5 w-5') {
  const match = ICON_OPTIONS.find((i) => i.label.toLowerCase() === (iconName || '').toLowerCase() || i.name.toLowerCase() === (iconName || '').toLowerCase())
  const Comp = match ? match.icon : Layers
  return <Comp className={className} />
}

