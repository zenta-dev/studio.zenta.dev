<script lang="ts">
  import { PUBLIC_DOMAIN, PUBLIC_NAME } from "$env/static/public";
  import Header from "@//components/Header.svelte";
  import Button from "@//components/ui/button/button.svelte";
  import SvelteSeo from "@//svelte-seo";

  import type { PageData } from "./$types.js";
  import SigininForm from "./(components)/signup-form.svelte";

  export let data: PageData;
</script>

<div class="flex flex-col h-full">
  <Header>
    <a href="/signin"> <Button>Sign In</Button> </a>
  </Header>
  <SigininForm data={data.form} className="m-auto " />
</div>

<SvelteSeo
  title={`Sign Up | ${PUBLIC_NAME}`}
  description="Sign Up to Zenta Studio for Effortless Tech, Tag, and Post Management"
  canonical={`${PUBLIC_DOMAIN}/signup`}
  keywords="sign up, zenta studio, seo, tech, tag, post, manage, effortlessly, integration, seamless, software, web, application, development, coding, programming"
  openGraph={{
    title: `Sign Up | ${PUBLIC_NAME}`,
    description:
      "Sign Up to Zenta Studio for Effortless Tech, Tag, and Post Management",
    url: `${PUBLIC_DOMAIN}/signup`,
    type: "website",
    site_name: `${PUBLIC_NAME}`,
  }}
  twitter={{
    card: "summary_large_image",
    site: "@zenta_studio",
    creator: "@zenta_studio",
    title: `Sign Up | ${PUBLIC_NAME}`,
    description:
      "Sign Up to Zenta Studio for Effortless Tech, Tag, and Post Management",
  }}
  jsonLd={{
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${PUBLIC_DOMAIN}/signup`,
    name: `${PUBLIC_NAME}`,
    description:
      "Sign Up to Zenta Studio for Effortless Tech, Tag, and Post Management",
  }}
/>
