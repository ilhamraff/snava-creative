import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { SiteSettings } from "./globals/SiteSettings";
import { AboutPage } from "./globals/AboutPage";
import { ServicesSection } from "./globals/ServicesSection";
import { Categories } from "./collections/Categories";
import { Portfolio } from "./collections/Portfolio";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: "- Snava Creative Admin",
      icons: [
        {
          rel: "icon",
          type: "image/x-icon",
          url: "/favicon.ico",
        },
      ],
    },
    components: {
      graphics: {
        Logo: "/components/admin/AdminLogo#AdminLogo",
        Icon: "/components/admin/AdminIcon#AdminIcon",
      },
    },
  },
  collections: [Users, Media, Categories, Portfolio],
  globals: [SiteSettings, AboutPage, ServicesSection],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: "media",
        },
      },
      bucket: process.env.SUPABASE_S3_BUCKET || "media",
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY || "",
          secretAccessKey: process.env.SUPABASE_S3_SECRET_KEY || "",
        },
        region: process.env.SUPABASE_S3_REGION || "ap-southeast-1",
        endpoint: process.env.SUPABASE_S3_ENDPOINT || "",
      },
    }),
  ],
});
