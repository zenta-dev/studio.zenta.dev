import { PUBLIC_DOMAIN } from "$env/static/public";
import { prisma } from "@//server/prisma";

export async function GET() {
    const posts = await prisma.post.findMany({
        select: {
            id: true,
            updatedAt: true,
        },
    });
    const tags = await prisma.tag.findMany({
        select: {
            id: true,
            updatedAt: true,
        },
    });
    const techs = await prisma.tech.findMany({
        select: {
            id: true,
            updatedAt: true,
        },
    });

    const allLastChanges = [
        ...posts.map((post) => post.updatedAt),
        ...tags.map((tag) => tag.updatedAt),
        ...techs.map((tech) => tech.updatedAt),
    ].sort((a, b) => b!.getTime() - a!.getTime())[0];



    const calcutaeChangeFreq = (date: Date) => {
        const diff = Date.now() - date.getTime();
        if (diff < 1000 * 60 * 60 * 24) {
            return "hourly";
        } else if (diff < 1000 * 60 * 60 * 24 * 7) {
            return "daily";
        } else if (diff < 1000 * 60 * 60 * 24 * 30) {
            return "weekly";
        } else if (diff < 1000 * 60 * 60 * 24 * 365) {
            return "monthly";
        } else {
            return "yearly";
        }
    }
    const generatePostUrls = (type: string, data: typeof posts) => {
        return data.map((post) => {
            return `
                <url>
                    <loc>${PUBLIC_DOMAIN}/${type}/${post.id}</loc>
                    <lastmod>${post.updatedAt?.toISOString()}</lastmod>
                    <changefreq>${calcutaeChangeFreq(post.updatedAt as Date)}</changefreq>
                    <priority>0.8</priority>
                </url>
            `;
        }).join("\n");
    }
    return new Response(
        `
        <?xml version="1.0" encoding="UTF-8" ?>
        <urlset
			xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="https://www.w3.org/1999/xhtml"
			xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
			xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
		>
            <url>
                <loc>${PUBLIC_DOMAIN}/</loc>
                <lastmod>${allLastChanges!.toISOString()}</lastmod>
                <changefreq>${calcutaeChangeFreq(allLastChanges!)}</changefreq> 
                <priority>1.0</priority>
            </url>
            ${generatePostUrls('post', posts)}
            ${generatePostUrls('tag', tags)}
            ${generatePostUrls('tech', techs)}
        </urlset>
        `.trim(),
        {
            headers: {
                'Content-Type': 'application/xml'
            }
        }
    );
}