<script lang="ts">
  import { PUBLIC_DOMAIN, PUBLIC_NAME } from "$env/static/public";
  import SvelteSeo from "@//svelte-seo";
</script>

<SvelteSeo
  title={`Dashboard | ${PUBLIC_NAME}`}
  description="Effortlessly Manage Tech, Tag, and Post with Zenta Studio for Seamless SEO Integration"
  canonical={`${PUBLIC_DOMAIN}/`}
  keywords="dashboard, zenta studio, seo, tech, tag, post, manage, effortlessly, integration, seamless, software, web, application, development, coding, programming"
  openGraph={{
    title: `Dashboard | ${PUBLIC_NAME}`,
    description:
      "Effortlessly Manage Tech, Tag, and Post with Zenta Studio for Seamless SEO Integration",
    url: `${PUBLIC_DOMAIN}/`,
    type: "website",
    site_name: `${PUBLIC_NAME}`,
  }}
  twitter={{
    card: "summary_large_image",
    site: "@zenta_studio",
    creator: "@zenta_studio",
    title: `Dashboard | ${PUBLIC_NAME}`,
    description:
      "Effortlessly Manage Tech, Tag, and Post with Zenta Studio for Seamless SEO Integration",
  }}
  jsonLd={{
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: `${PUBLIC_DOMAIN}/`,
    name: `${PUBLIC_NAME}`,
    description:
      "Effortlessly Manage Tech, Tag, and Post with Zenta Studio for Seamless SEO Integration",
  }}
/>

<h1>Dashboard</h1>
