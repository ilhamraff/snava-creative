import {
  FaInstagram,
  FaLinkedin,
  FaBehance,
  FaDribbble,
  FaYoutube,
  FaFacebook,
  FaGithub,
  FaTiktok,
  FaPinterest,
  FaWhatsapp,
  FaTelegram,
  FaThreads,
} from 'react-icons/fa6'
import { FaXTwitter } from 'react-icons/fa6'
import type { IconType } from 'react-icons'

/**
 * Centralized mapping from platform name (stored in CMS) to React icon component.
 * Icon components are a frontend concern — never stored in the database.
 *
 * To add a new platform:
 * 1. Add option in `globals/SiteSettings.ts` select field
 * 2. Add mapping here
 */
export const socialPlatformIcons: Record<string, IconType> = {
  Instagram: FaInstagram,
  LinkedIn: FaLinkedin,
  Behance: FaBehance,
  Dribbble: FaDribbble,
  YouTube: FaYoutube,
  Twitter: FaXTwitter,
  Facebook: FaFacebook,
  GitHub: FaGithub,
  TikTok: FaTiktok,
  Pinterest: FaPinterest,
  WhatsApp: FaWhatsapp,
  Telegram: FaTelegram,
  Threads: FaThreads,
}

export function getSocialIcon(platform: string): IconType | undefined {
  return socialPlatformIcons[platform]
}
