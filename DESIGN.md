# Snava Creative: panduan desain

Dokumen ini mencatat bahasa visual yang sudah dipakai di situs publik dan panel admin Snava Creative. Sumber implementasi tetap berada di `app/(frontend)/styles.css`, `app/admin/styles.css`, dan komponen terkait. Gunakan panduan ini saat membuat halaman baru agar keputusan visualnya selaras dengan proyek, lalu periksa kembali nilai di kode jika keduanya berbeda.

## 1. Identitas dan arah visual

Snava Creative adalah agensi kreatif dengan layanan branding, desain, website, foto, video, dan dokumentasi. Situs publik menempatkan karya serta pesan utama sebagai pusat perhatian. Tampilannya editorial dan lapang: tipografi besar, bidang hitam-putih, garis tipis, foto berukuran besar, dan aksen indigo yang dipakai seperlunya. Logo resmi memakai bentuk lengkung geometris dan wordmark hitam atau putih. Pakai aset yang sudah ada di `public/assets/`, bukan logo atau motif pengganti.

**Dial situs publik:** ENERGY 2 / RHYTHM 2 / MOTION 2. Judul berukuran besar memberi tenaga, susunan bagian berganti antara daftar, grid karya, dan bidang kontras, sementara gerak membantu masuknya konten serta respons interaksi.

**Dial admin:** ENERGY 1 / RHYTHM 1 / MOTION 1. Panel mengutamakan pemindaian data dan penyelesaian tugas melalui navigasi tetap, kartu ringkasan, formulir, dan status yang mudah dibedakan.

Fokus visual tiap halaman harus jelas. Di beranda, fokus awal adalah judul hero; di halaman portofolio, karya; di halaman layanan, judul layanan dan visualnya; di admin, judul halaman serta tindakan yang terkait. Indigo menandai tindakan, status aktif, atau umpan balik. Jangan menjadikannya warna setiap judul dan bidang.

## 2. Warna dan tema situs publik

Tema publik mengikuti atribut `html[data-theme]`. Tema awal adalah **light**; pilihan pengguna disimpan dengan kunci `snava-theme`. Nilai di bawah berasal dari `app/(frontend)/styles.css`.

| Peran | Light | Dark | Pemakaian |
| --- | --- | --- | --- |
| `background` | Putih hangat `#FAFAFA` | Hitam `#000000` | Latar halaman utama |
| `foreground` | Hitam lunak `#111111` | Putih `#FFFFFF` | Teks utama, garis penekanan, serta bidang kontras |
| `surface` | Putih `#FFFFFF` | Hitam hampir pekat `#0A0A0A` | Kartu dan area isi |
| `surface-elevated` | Abu sangat terang `#F3F4F6` | Arang gelap `#141414` | Hover dan lapisan sekunder |
| `border` | Abu terang `#E5E7EB` | Abu gelap `#1F1F1F` | Pemisah, tepian kartu, kontrol |
| `muted` | Abu teks `#6B7280` | Abu teks `#737373` | Deskripsi dan metadata |
| `charcoal` | Abu sedang `#9CA3AF` | Arang `#4D4D4D` | Perubahan tepian dan detail sekunder |

Aksen lintas tema adalah indigo `#4F46E5` (`accent`), dengan keadaan terang `#6366F1` (`accent-light`) dan gelap `#3730A3` (`accent-dark`). Tombol dasar memakai aksen ini, tetapi CTA besar di hero, portofolio, dan penutup sering memakai pasangan `foreground`/`background` agar kontras monokrom tetap dominan. Bila memakai aksen untuk teks kecil, periksa kontrasnya pada kedua tema.

Blok About dan CTA akhir membalik `foreground` menjadi latar serta `background` menjadi teks. Pergantian bidang ini memberi jeda kuat di antara bagian yang lebih tenang. Gunakan pola pembalikan hanya saat suatu bagian memang perlu menjadi titik perhatian.

## 3. Tipografi

| Peran | Keluarga | Penerapan yang ada |
| --- | --- | --- |
| Judul | Space Grotesk (`font-display`) | Hero, judul bagian, judul kartu dan layanan; rapat dengan `tracking-tight` |
| Isi | Hind (`font-sans`) | Paragraf, navigasi, tombol; deskripsi sering memakai bobot ringan dan `leading-relaxed` |
| Metadata | JetBrains Mono (`font-mono`) | Nomor layanan, kategori dan tahun karya, label teknis pendek |
| Admin | System UI (`font-admin`) | Semua navigasi, formulir, tabel, dan ringkasan admin |

Hero publik naik dari `text-4xl` pada layar kecil ke sekitar `6rem` pada layar besar. Judul bagian umumnya berada pada rentang `text-3xl` sampai `text-6xl`, sesuai perannya. Paragraf utama memakai ukuran `text-base` sampai `text-xl`. Label kecil dapat memakai huruf kapital dengan jarak huruf lebih lebar untuk kategori, tab, dan metadata; jangan memakainya untuk paragraf panjang.

Hierarki dibangun dari skala, ketebalan, ruang, dan warna. Satu judul utama memimpin tiap layar. Teks pendukung memakai `muted`, sedangkan metadata mono tetap menjadi detail, bukan pesaing judul.

## 4. Tata letak dan ritme

- Konten publik memakai `Container` dengan lebar maksimum `max-w-7xl` dan gutter `px-5`, `sm:px-6`, `lg:px-8`.
- Bagian utama lazim memakai ruang vertikal `py-24` dan `lg:py-32`. Hero mengambil setidaknya tinggi layar; halaman dalam memberi ruang atas untuk navbar tetap.
- Judul bagian sering disandingkan dengan deskripsi dalam dua kolom pada desktop, lalu ditumpuk pada layar kecil. Pertahankan batas lebar paragraf agar mudah dibaca.
- Daftar layanan memakai baris bernomor dengan pemisah horizontal. Portofolio memakai gambar dominan dalam grid satu, dua, lalu tiga kolom, dengan rasio gambar sekitar `4:5` atau `3:4`. Harga memakai kolom satu, dua, lalu hingga tiga sesuai jumlah paket.
- Ruang kosong memisahkan kelompok informasi. Gunakan garis halus untuk struktur dan pengelompokan, bukan kartu di setiap tempat. Blok warna terbalik memberi perubahan ritme yang disengaja.
- Navbar publik setinggi `h-16`, tetap di atas, lalu mendapat latar tembus pandang dan blur setelah pengguna menggulir. Pada layar kecil, navigasi berpindah ke menu layar penuh.

## 5. Bentuk, komponen, dan kedalaman

**Tombol publik.** Komponen `Button` memiliki ukuran `sm` 36 px, `md` 44 px, dan `lg` 48 px. Variannya `primary` indigo, `secondary` bergaris, dan `ghost` tanpa bidang. Bentuk dasarnya bersudut tegas (`rounded-none`). CTA besar pada halaman utama sering membalik warna teks dan latar. Setiap tombol perlu tujuan atau aksi yang jelas serta keadaan hover, aktif, fokus, dan nonaktif bila relevan.

**Kartu publik.** Komponen `Card` umum memakai sudut `rounded-2xl`, garis tipis, dan bidang `surface`; saat hover ia sedikit terangkat dan mendapat bayangan lembut. Ini bukan bentuk baku semua konten. Kartu kapabilitas dan layanan terkait di halaman detail justru bersudut tegas. Daftar layanan dan paket harga memakai garis pembatas alih-alih kotak penuh.

**Badge dan tab.** `Badge` umum berbentuk pil kecil untuk label ringkas. Tab kategori portofolio dan harga berupa teks kapital kecil dengan garis bawah aktif, bukan tombol berisi warna. Badge paket harga menggunakan label kecil bergaris dengan sudut tegas. Pilih bentuk menurut fungsi komponen, bukan menyamakan semua elemen.

**Gambar dan logo.** Karya ditampilkan sebagai foto atau visual proyek yang memenuhi bingkai melalui `object-cover`; efek hover memperbesar gambar sedikit. Logo publik tersedia sebagai `logo-black.png` dan `logo-white.png`, dipilih sesuai tema. Visual layanan memakai rasio persegi atau `4:3` dan, jika gambar belum tersedia, komponen sekarang menampilkan placeholder yang jelas. Jangan mengganti karya nyata dengan gambar generik.

**Kedalaman.** Situs publik kebanyakan datar. Garis, pergantian bidang, dan ruang kosong membentuk lapisan. Bayangan dipakai pada tombol primer atau hover kartu; blur pada navbar membantu menjaga keterbacaan saat menggulir.

## 6. Gerak dan interaksi

Animasi publik memakai `motion/react`. Hero masuk dengan perubahan opasitas dan gerak vertikal; bagian lain memakai reveal sekitar 0,5 sampai 0,8 detik, serta stagger pendek pada daftar. Filter portofolio dan harga menggerakkan garis tab dan perubahan grid. Hover pada karya memperbesar gambar perlahan, sementara panah pada tautan bergerak sedikit mengikuti arah tujuannya.

Gerak harus menjelaskan perubahan keadaan atau memandu perhatian. Jangan menambahkan animasi pada semua elemen sekaligus. `MotionProvider` memakai `reducedMotion="user"`; CSS publik juga mematikan animasi marquee dan float serta smooth scroll saat pengguna meminta gerak dikurangi. Pertahankan perilaku ini pada komponen baru.

Fokus keyboard global diberi outline indigo 2 px dengan jarak 2 px. Kontrol baru perlu label yang jelas, fokus terlihat, dan keadaan aktif atau terbuka yang dapat dikenali tanpa hanya mengandalkan warna.

## 7. Panel admin

Admin memakai sistem terpisah pada `app/admin/styles.css`. Tema awalnya **light**, disimpan dengan kunci `snava-admin-theme`; kelas utilitas zinc dan indigo dipetakan ulang saat tema terang aktif. Jangan menggunakan token publik `background`, `surface`, atau font display untuk layar admin.

| Token admin | Light | Dark | Peran |
| --- | --- | --- | --- |
| `admin-bg` | `#F8FAFC` | `#09090B` | Latar area kerja |
| `admin-surface` | `#FFFFFF` | `#141417` | Kartu dan panel |
| `admin-surface-hover` | `#F4F4F5` | `#1E1E24` | Hover bidang |
| `admin-border` | `#E4E4E7` | `#27272A` | Garis pemisah |
| `admin-accent` | `#4F46E5` | `#4F46E5` | Tindakan utama dan status aktif |
| `admin-accent-hover` | `#4338CA` | `#4338CA` | Hover tindakan utama |

Dashboard memakai sidebar tetap selebar `w-64` pada desktop, header dan panel geser pada mobile, serta area isi `max-w-6xl`. Kartu ringkasan tersusun satu, dua, lalu tiga kolom. Admin lebih padat daripada situs publik: teks kecil, radius `rounded-lg` atau `rounded-xl`, batas bidang yang jelas, dan bayangan secukupnya. Formulir memakai label di atas input, tepian netral, fokus indigo, serta umpan balik kesalahan. Merah, hijau, dan amber muncul sebagai warna status sesuai konteks, bukan aksen merek tambahan.

Gerak admin terbatas pada hover, transisi sidebar, dialog, dan status proses. CSS admin mengurangi durasi animasi dan transisi saat `prefers-reduced-motion: reduce` aktif.

## 8. Suara konten

Situs memakai campuran bahasa Indonesia dan Inggris yang memang terlihat pada judul, navigasi, dan CTA sekarang. Untuk konten baru, gunakan bahasa Indonesia yang langsung, spesifik pada layanan atau karya, dan cocok dengan halaman sekitarnya. Nama layanan, harga, hasil, testimoni, dan klaim harus berasal dari data yang tersedia; jangan menambahkan angka atau cerita klien sebagai ornamen. CTA harus menyebut tindakan yang terjadi, seperti melihat karya, memilih paket, atau menghubungi tim.

Konten beranda, layanan, paket, portofolio, dan footer dapat berasal dari database melalui `lib/data/get-*.ts`, dengan fallback statis di `lib/data/`. Karena itu, panjang judul dan deskripsi bisa berubah. Komposisi baru harus tetap terbaca saat konten lebih panjang, kosong, atau belum memiliki gambar.

## 9. Lokasi rujukan implementasi

| Yang ingin diubah | Rujukan utama |
| --- | --- |
| Warna, font, tema, fokus publik | `app/(frontend)/styles.css`, `app/(frontend)/layout.tsx`, `components/theme-provider.tsx` |
| Container, tombol, kartu, badge, header | `components/ui/` |
| Ritme beranda dan halaman detail | `app/(frontend)/page.tsx`, `components/sections/`, `components/pricing/` |
| Navigasi dan logo | `components/layout/navbar.tsx`, `components/sections/footer.tsx`, `public/assets/` |
| Gerak | `components/motion-provider.tsx`, `lib/utils/motion.ts` |
| Warna, tema, navigasi, formulir admin | `app/admin/styles.css`, `app/admin/(dashboard)/_components/admin-sidebar.tsx`, `app/admin/` |

Panduan ini mendeskripsikan implementasi saat ini. Bila sebuah layar baru perlu menyimpang, tulis alasan fungsionalnya di dekat keputusan desain tersebut dan perbarui panduan bila penyimpangan menjadi pola yang dipakai berulang.
