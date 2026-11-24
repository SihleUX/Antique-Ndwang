# Antique Ndwang

A considered digital home for independent fashion label Antique Ndwang, built with Next.js App Router, TypeScript, Tailwind CSS, Motion, and GSAP.

## Getting started

```bash
npm install
npm run dev
```

Optional commerce and editorial integrations can be configured with the environment variables below:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

The storefront and CMS clients are safe to import before these are set; API calls will return an explicit configuration error.
