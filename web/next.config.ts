import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  images: {
    domains: ['live-immo.staticlbi.com', 'img.leboncoin.fr', 'cdn.pap.fr', 'res.listglobally.com', 'lh3.googleusercontent.com', 'file.bienici.com', 'v.seloger.com','d7b3sch6x3cpd.cloudfront.net', 'www.century21.fr','media.immobilier.notaires.fr','img.gensdeconfiance.com','media.topannonces.fr', 'i1.static.athome.eu'],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

export default nextConfig;