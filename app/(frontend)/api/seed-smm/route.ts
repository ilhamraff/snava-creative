import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function GET() {
  try {
    const payload = await getPayloadClient()

    // Cek apakah service sudah ada
    const existingRes = await (payload as any).find({
      collection: 'services',
      where: { slug: { equals: 'social-media-management' } },
    })

    const data = {
      title: 'Social Media Management',
      slug: 'social-media-management',
      category: 'Social Media',
      description: 'Snava membantu bisnis mengelola social media melalui content planning, visual content, basic video/motion, caption & hashtag, content strategy, dan performance reporting.',
      icon: 'Megaphone',
      isActive: true,
      sortOrder: 1,
      hero: {
        headline: 'Build a Stronger Presence on Social Media',
        description: 'Snava membantu merencanakan dan mengelola konten social media agar brand dapat tampil lebih konsisten, relevan, dan terarah. Tinggalkan kerumitan, dan biarkan kami membangun presensi digital Anda.',
        ctaPrimaryLabel: 'Konsultasi Sekarang',
        ctaSecondaryLabel: 'Lihat Portfolio',
      },
      problems: [
        {
          title: 'Inconsistent Content',
          description: 'Sulit menjaga konten tetap konsisten setiap minggu.',
        },
        {
          title: 'No Clear Content Direction',
          description: 'Tidak tahu konten apa yang harus dibuat dan diprioritaskan.',
        },
        {
          title: 'Limited Time',
          description: 'Terlalu sibuk menjalankan bisnis untuk mengelola social media.',
        },
        {
          title: 'Inconsistent Visual Identity',
          description: 'Konten terlihat tidak konsisten dan belum merepresentasikan brand dengan baik.',
        },
      ],
      capabilities: [
        {
          title: 'Content Planning',
          description: 'Merencanakan konten berdasarkan karakter brand, audience, dan tujuan komunikasi.',
          icon: 'PenTool',
        },
        {
          title: 'Social Media Design',
          description: 'Membuat desain feed yang konsisten dengan identitas visual brand.',
          icon: 'Palette',
        },
        {
          title: 'Video & Motion',
          description: 'Membuat basic video editing atau motion content untuk memperkaya variasi konten.',
          icon: 'Video',
        },
        {
          title: 'Caption & Hashtag',
          description: 'Membantu menyiapkan caption dan hashtag yang relevan dengan konten.',
          icon: 'FileText',
        },
        {
          title: 'Content Strategy',
          description: 'Menyusun direction dan strategi konten agar komunikasi social media lebih terarah.',
          icon: 'Lightbulb',
        },
        {
          title: 'Traffic Report',
          description: 'Menyediakan laporan performa sebagai bahan evaluasi konten.',
          icon: 'Globe', // Globe is available in the options
        },
      ],
      faqs: [
        {
          question: 'Apakah Social Media Management sudah termasuk desain konten?',
          answer: 'Ya, paket kami sudah mencakup desain visual untuk feed Instagram Anda sesuai dengan jumlah konten yang tertera pada paket.',
        },
        {
          question: 'Apakah bisa request custom package?',
          answer: 'Tentu. Jika kebutuhan Anda tidak sesuai dengan paket Basic atau Standard, kami menyediakan Custom Package yang dapat disesuaikan.',
        },
        {
          question: 'Apakah bisa request video content?',
          answer: 'Ya, setiap paket sudah mencakup basic video editing atau motion content dengan kuota yang berbeda.',
        },
        {
          question: 'Apakah Snava hanya membuat desain atau juga membantu content planning?',
          answer: 'Kami tidak hanya mendesain, tetapi juga membantu content planning dan strategy content deck agar konten Anda lebih terarah.',
        },
        {
          question: 'Apakah mendapatkan laporan performa?',
          answer: 'Ya, Anda akan mendapatkan Traffic Report untuk mengevaluasi performa konten secara berkala.',
        },
        {
          question: 'Apakah bisa menyesuaikan jumlah konten?',
          answer: 'Untuk penyesuaian jumlah konten di luar paket yang ada, silakan konsultasikan kebutuhan Anda dengan tim Snava melalui Custom Package.',
        },
      ],
      packages: [
        {
          name: 'Basic Package',
          price: 550000,
          billingPeriod: 'Per Bulan',
          features: [
            { name: '10 Static Feed Instagram', included: true },
            { name: '2 Basic Video Edit or Motion', included: true },
            { name: 'Content Planning', included: true },
            { name: 'Caption & Hashtag', included: true },
            { name: 'Strategy Content Deck', included: true },
            { name: 'Traffic Report', included: true },
          ],
          isPopular: false,
          isCustom: false,
        },
        {
          name: 'Standard Package',
          price: 800000,
          billingPeriod: 'Per Bulan',
          features: [
            { name: '15 Static Feed Instagram', included: true },
            { name: '3 Basic Video Edit or Motion', included: true },
            { name: 'Content Planning', included: true },
            { name: 'Caption & Hashtag', included: true },
            { name: 'Strategy Content Deck', included: true },
            { name: 'Traffic Report', included: true },
          ],
          isPopular: true,
          isCustom: false,
        },
        {
          name: 'Custom Package',
          description: 'Discuss with the admin for custom social media plan',
          features: [
            { name: 'Custom Feed Amount', included: true },
            { name: 'Custom Video Amount', included: true },
            { name: 'Platform Integration', included: true },
            { name: 'Full Strategy Deck', included: true },
          ],
          isPopular: false,
          isCustom: true,
        },
      ]
    }

    if (existingRes.docs && existingRes.docs.length > 0) {
      // Update
      const doc = existingRes.docs[0]
      await (payload as any).update({
        collection: 'services',
        id: doc.id,
        data: data,
      })
      return NextResponse.json({ message: 'Social Media Management service updated successfully', success: true })
    } else {
      // Create
      await (payload as any).create({
        collection: 'services',
        data: data,
      })
      return NextResponse.json({ message: 'Social Media Management service created successfully', success: true })
    }

  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
