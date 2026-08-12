import { redirect } from 'next/navigation'

export default function ServicesRedirectPage() {
  // Mengarahkan otomatis ke homepage bagian layanan
  redirect('/#layanan')
}
