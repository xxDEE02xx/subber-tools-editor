import type { Metadata } from 'next'
import '@/styles/globals.css'
import ThemeRegistry from '@/utils/registry'

export const metadata: Metadata = {
  title: 'Subber',
  description: 'Editor Tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" type="image/png" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/favicon.a07d7c899ee.ico" />
        <link rel="apple-touch-icon" sizes="192x192" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-192x192.9c71dd3285e.png" />
        <link rel="apple-touch-icon-precomposed" sizes="192x192" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-192x192.9c71dd3285e.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-180x180.40bf4ed3b02.png" />
        <link rel="apple-touch-icon-precomposed" sizes="180x180" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-180x180.40bf4ed3b02.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-152x152.2b6894b4904.png" />
        <link rel="apple-touch-icon-precomposed" sizes="152x152" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-152x152.2b6894b4904.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-144x144.d05d6be5e07.png" />
        <link rel="apple-touch-icon-precomposed" sizes="144x144" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-144x144.d05d6be5e07.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-120x120.a35bd41f0f6.png" />
        <link rel="apple-touch-icon-precomposed" sizes="120x120" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-120x120.a35bd41f0f6.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-114x114.1d29cee1707.png" />
        <link rel="apple-touch-icon-precomposed" sizes="114x114" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-114x114.1d29cee1707.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-76x76.ac48daf9bdc.png" />
        <link rel="apple-touch-icon-precomposed" sizes="76x76" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-76x76.ac48daf9bdc.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-72x72.befdd865a1b.png" />
        <link rel="apple-touch-icon-precomposed" sizes="72x72" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-72x72.befdd865a1b.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-60x60.2c4c1f5a803.png" />
        <link rel="apple-touch-icon-precomposed" sizes="60x60" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-60x60.2c4c1f5a803.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-57x57.016e95d1499.png" />
        <link rel="apple-touch-icon-precomposed" sizes="57x57" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-57x57.016e95d1499.png" />
        <link rel="apple-touch-icon" href="https://1.viki.io/a/vwk8s/staging/_next/static/images/apple-touch-icon-192x192.9c71dd3285e.png" />
      </head>
      <body>
        <ThemeRegistry options={{ key: 'mui-theme' }}>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  )
}
