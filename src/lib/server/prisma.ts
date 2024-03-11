import { DATABASE_URL } from "$env/static/private";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

type ModelNames = Prisma.ModelName
export type PrismaModels = {
    [M in ModelNames]: Exclude<
        Awaited<ReturnType<PrismaClient[Uncapitalize<M>]["findUnique"]>>,
        null
    >;
};

export type UserModel = PrismaModels["User"]
export type TechModel = PrismaModels["Tech"]