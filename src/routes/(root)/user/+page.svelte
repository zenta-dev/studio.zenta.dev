<script lang="ts">
  import { PUBLIC_DOMAIN, PUBLIC_NAME } from "$env/static/public";
  import SvelteSeo from "@//svelte-seo";
</script>

<h1>Users</h1>

<SvelteSeo
  title={`Users | ${PUBLIC_NAME}`}
  description="Effortlessly Manage Users with Zenta Studio for Seamless SEO Integration"
  canonical={`${PUBLIC_DOMAIN}/user`}
  keywords="users, zenta studio, seo, tech, tag, post, manage, effortlessly, integration, seamless, software, web, application, development, coding, programming"
  openGraph={{
    title: `Users | ${PUBLIC_NAME}`,
    description:
      "Effortlessly Manage Users with Zenta Studio for Seamless SEO Integration",
    url: `${PUBLIC_DOMAIN}/user`,
    type: "website",
    site_name: `${PUBLIC_NAME}`,
  }}
  twitter={{
    card: "summary_large_image",
    site: "@zenta_studio",
    creator: "@zenta_studio",
    title: `Users | ${PUBLIC_NAME}`,
    description:
      "Effortlessly Manage Users with Zenta Studio for Seamless SEO Integration",
  }}
  jsonLd={{
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: `${PUBLIC_DOMAIN}/user`,
    name: `${PUBLIC_NAME}`,
    description:
      "Effortlessly Manage Users with Zenta Studio for Seamless SEO Integration",
  }}
/>
