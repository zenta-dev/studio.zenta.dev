console.log("Seeding started🚀");

import { PrismaClient, TechFounderType } from "@prisma/client";
const prisma = new PrismaClient();

// user seed
const userSeeder = async () => {
    const user = {
        email: "zenta@seeder.com",
        password: import.meta.env.SEEDER_PASSWORD || "",
        name: "Zenta Seeder",
        role: "ADMIN",
    };
    console.log(`Seeding user: ${user.email} 🌱`);
    const hash = await Bun.password.hash(user.password, {
        algorithm: "bcrypt",
        cost: parseInt(import.meta.env.SALT_ROUNDS || "10"),
    });
    const res = await prisma.user.upsert({
        where: {
            email: user.email,
        },
        update: {
            email: user.email,
            password: hash,
            name: user.name,
            role: "ADMIN",
        },
        create: {
            email: user.email,
            password: hash,
            name: user.name,
            role: "ADMIN",
        },
    });
    return res;
};

interface Founder {
    name: string;
    url: string;
    photo: string;
    type?: TechFounderType;
}

interface TechDetails {
    name: string;
    description: string;
    logo: string;
    url: string;
    homepage?: string | null;
}

interface Tech {
    founder: Founder;
    details: TechDetails;
}

const techs: Tech[] = [
    // java founder
    {
        founder: {
            name: "James Gosling",
            url: "https://en.wikipedia.org/wiki/James_Gosling",
            photo:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/James_Gosling_2008.jpg/330px-James_Gosling_2008.jpg",
        },
        details: {
            name: "Java",
            description:
                "Java is a class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.",
            logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Java_programming_language_logo.svg/131px-Java_programming_language_logo.svg.png",
            url: "https://en.wikipedia.org/wiki/Java_(programming_language)",
            homepage: "https://www.java.com/",
        },
    },
    // python founder
    {
        founder: {
            name: "Guido van Rossum",
            url: "https://en.wikipedia.org/wiki/Guido_van_Rossum",
            photo:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Guido_van_Rossum_OSCON_2006.jpg/330px-Guido_van_Rossum_OSCON_2006.jpg",
        },
        details: {
            name: "Python",
            description:
                "Python is an interpreted, high-level and general-purpose programming language.",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/131px-Python-logo-notext.svg.png",
            url: "https://en.wikipedia.org/wiki/Python_(programming_language)",
            homepage: "https://www.python.org/",
        },
    },
    // javascript founder
    {
        founder: {
            name: "Brendan Eich",
            url: "https://en.wikipedia.org/wiki/Brendan_Eich",
            photo:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Brendan_Eich_Mozilla_Foundation_official_photo.jpg/330px-Brendan_Eich_Mozilla_Foundation_official_photo.jpg",
        },
        details: {
            name: "JavaScript",
            description:
                "JavaScript is a text-based programming language used both on the client-side and server-side that allows you to make web pages interactive.",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/131px-JavaScript-logo.png",
            url: "https://en.wikipedia.org/wiki/JavaScript",
            homepage: "https://www.javascript.com/",
        },
    },
    // typescript founder
    {
        founder: {
            name: "Microsoft",
            url: "https://en.wikipedia.org/wiki/TypeScript",
            photo:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/375px-Microsoft_logo_%282012%29.svg.png",
            type: TechFounderType.COMPANY,
        },
        details: {
            name: "TypeScript",
            description:
                "TypeScript is a strict syntactical superset of JavaScript that adds optional static typing to the language.",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/131px-Typescript_logo_2020.svg.png",
            url: "https://en.wikipedia.org/wiki/TypeScript",
            homepage: "https://www.typescriptlang.org/",
        },
    },
    // c founder
    {
        founder: {
            name: "Dennis Ritchie",
            url: "https://en.wikipedia.org/wiki/Dennis_Ritchie",
            photo:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Dennis_Ritchie_2011.jpg/330px-Dennis_Ritchie_2011.jpg",
        },
        details: {
            name: "C",
            description:
                "C is a general-purpose, procedural computer programming language supporting structured programming, lexical variable scope, and recursion, with a static type system.",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/C_Logo.png/131px-C_Logo.png",
            url: "https://en.wikipedia.org/wiki/C_(programming_language)",
            homepage: "https://en.wikipedia.org/wiki/C_(programming_language)",
        },
    },
    // c++ founder
    {
        founder: {
            name: "Bjarne Stroustrup",
            url: "https://en.wikipedia.org/wiki/Bjarne_Stroustrup",
            photo:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Bjarne-stroustrup_%28cropped%29.jpg/330px-Bjarne-stroustrup_%28cropped%29.jpg",
        },
        details: {
            name: "C++",
            description:
                'C++ is a general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language, or "C with Classes".',
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/131px-ISO_C%2B%2B_Logo.svg.png",
            url: "https://en.wikipedia.org/wiki/C%2B%2B",
            homepage: "https://isocpp.org/",
        },
    },
    // kotlin founder
    {
        founder: {
            name: "JetBrains",
            url: "https://en.wikipedia.org/wiki/JetBrains",
            photo:
                "https://upload.wikimedia.org/wikipedia/en/thumb/0/08/JetBrains_beam_logo.svg/330px-JetBrains_beam_logo.svg.png",
            type: TechFounderType.COMPANY,
        },
        details: {
            name: "Kotlin",
            description:
                "Kotlin is a cross-platform, statically typed, general-purpose programming language with type inference.",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Kotlin_logo_2021.svg/270px-Kotlin_logo_2021.svg.png",
            url: "https://en.wikipedia.org/wiki/Kotlin_(programming_language)",
            homepage: "https://kotlinlang.org/",
        },
    },
    // dart founder
    {
        founder: {
            name: "Google",
            url: "https://en.wikipedia.org/wiki/Google",
            photo:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/330px-Google_2015_logo.svg.png",
            type: TechFounderType.COMPANY,
        },
        details: {
            name: "Dart",
            description:
                "Dart is a client-optimized programming language for fast apps on any platform.",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Dart-logo.png/131px-Dart-logo.png",
            url: "https://en.wikipedia.org/wiki/Dart_(programming_language)",
            homepage: "https://dart.dev/",
        },
    },
    // go founder
    {
        founder: {
            name: "Google",
            url: "https://en.wikipedia.org/wiki/Google",
            photo:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/330px-Google_2015_logo.svg.png",
            type: TechFounderType.COMPANY,
        },
        details: {
            name: "Go",
            description:
                "Go is a statically typed, compiled programming language designed at Google.",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Go_Logo_Blue.svg/131px-Go_Logo_Blue.svg.png",
            url: "https://en.wikipedia.org/wiki/Go_(programming_language)",
            homepage: "https://golang.org/",
        },
    },
    // rust founder
    {
        founder: {
            name: "Graydon Hoare",
            url: "https://en.wikipedia.org/wiki/Graydon_Hoare",
            photo:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Rust_programming_language_black_logo.svg/182px-Rust_programming_language_black_logo.svg.png",
        },
        details: {
            name: "Rust",
            description:
                "Rust is a multi-paradigm systems programming language focused on safety, especially safe concurrency.",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Rust_programming_language_black_logo.svg/131px-Rust_programming_language_black_logo.svg.png",
            url: "https://en.wikipedia.org/wiki/Rust_(programming_language)",
            homepage: "https://www.rust-lang.org/",
        },
    },
    // php founder
    {
        founder: {
            name: "Rasmus Lerdorf",
            url: "https://en.wikipedia.org/wiki/Rasmus_Lerdorf",
            photo:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Rasmus_Lerdorf_August_2014_%28cropped%29.JPG/330px-Rasmus_Lerdorf_August_2014_%28cropped%29.JPG",
        },
        details: {
            name: "PHP",
            description:
                "PHP is a general-purpose scripting language especially suited to web development.",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/PHP-logo.svg/131px-PHP-logo.svg.png",
            url: "https://en.wikipedia.org/wiki/PHP",
            homepage: "https://www.php.net/",
        },
    },
    // ruby founder
] as const;

// tech seed
const techSeeder = async () => {
    const admin = await userSeeder();
    for (const tech of techs) {
        console.log(`Seeding tech: ${tech.details.name} 🌱`);
        const res = await prisma.tech.upsert({
            where: {
                name: tech.details.name,
            },
            update: {
                updatedBy: {
                    connect: {
                        email: admin.email,
                    },
                },
                updatedAt: new Date(),
                name: tech.details.name,
                description: tech.details.description,
                logo: tech.details.logo,
                url: tech.details.url,
                homepage: tech.details.homepage,
                founder: {
                    connectOrCreate: {
                        where: {
                            name: tech.founder.name,
                        },
                        create: {
                            name: tech.founder.name,
                            url: tech.founder.url,
                            photo: tech.founder.photo,
                            createdBy: {
                                connect: {
                                    email: admin.email,
                                },
                            },
                        },
                    },
                },
            },
            create: {
                createdBy: {
                    connect: {
                        id: admin.id,
                    },
                },
                name: tech.details.name,
                description: tech.details.description,
                logo: tech.details.logo,
                url: tech.details.url,
                homepage: tech.details.homepage || null,
                founder: {
                    connectOrCreate: {
                        where: {
                            name: tech.founder.name,
                        },
                        create: {
                            name: tech.founder.name,
                            url: tech.founder.url,
                            photo: tech.founder.photo,
                            type: tech.founder.type,
                            createdBy: {
                                connect: {
                                    email: admin.email,
                                },
                            },
                        },
                    },
                },
            },
        });
        console.log(`Seeded tech: ${tech.details.name} 🌱`);
    }
};

await techSeeder();
