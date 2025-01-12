import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'live-immo.staticlbi.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.leboncoin.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pap.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.listglobally.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'file.bienici.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'v.seloger.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd7b3sch6x3cpd.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.century21.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.immobilier.notaires.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.gensdeconfiance.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.topannonces.fr',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i1.static.athome.eu',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ouestfrance-immo.com',
        pathname: '/**',
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

export default nextConfig;