import type { ComboboxInterface } from '@//constants';
import { prisma } from '@//server/prisma';
import { error, fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { postFormSchema } from './(components)/schema';

export const load = (async () => {
    const post = await prisma.post.findMany({
        include: {
            authors: true,
        },
    });
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            photo: true,
        },
        where: {
            role: 'ADMIN',
            name: {
                not: 'Zenta Seeder',
            },
        }
    })
    const tags = await prisma.tag.findMany({
        select: {
            id: true,
            name: true,
            photo: true,
        },
    });
    const stack = await prisma.tech.findMany({
        select: {
            id: true,
            name: true,
            logo: true,
        },
    });

    const mappedUser: ComboboxInterface[] = users.map((e) => {
        return {
            photo: e.photo || undefined,
            value: e.id,
            label: e.name || e.email || e.id,
        };
    });
    const mappedTags: ComboboxInterface[] = tags.map((e) => {
        return {
            photo: e.photo || undefined,
            value: e.id,
            label: e.name,
        };
    })
    const mappedStack: ComboboxInterface[] = stack.map((e) => {
        return {
            photo: e.logo || undefined,
            value: e.id,
            label: e.name,
        };
    })
    return {
        post,
        users: mappedUser,
        tags: mappedTags,
        stack: mappedStack,
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    create: async (event) => {
        const form = await superValidate(event, zod(postFormSchema));

        if (!form.valid) {
            console.log("FAIL REASON: ", form.errors)
            return fail(400, {
                form,
            });
        }

        const { data } = form;

        console.log("DATA: ", data)

        const find = await prisma.post.findUnique({
            where: {
                slug: data.slug || data.title.toLowerCase().replace(/\s/g, "-"),
            },
        });

        if (find) {
            error(400, {
                message: `Slug already exists.`,
                description: `Please choose a different slug.`,
            });
        }

        const post = await prisma.post.create({
            data: {
                title: data.title,
                slug: data.slug || data.title.toLowerCase().replace(/\s/g, "-"),
                published: data.published,
                authors: {
                    connect: data.authors.map((author) => ({ id: author.id })),
                },
                tags: {
                    connect: data.tags.map((tag) => ({ id: tag.id })),
                },
                stack: {
                    connect: data.stacks.map((stack) => ({ id: stack.id })),
                },
                cover: data.cover,
                content: data.content,
            },
        });

        return message(form, {
            message: `Post created successfully.`,
            description: `The post has been created successfully.`,
            data: post,
        });
    },
    update: async (event) => {
        console.log('update')
    },
    delete: async (event) => {
        console.log('delete')
    },
}