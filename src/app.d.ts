// See https://kit.svelte.dev/docs/types#app

import type { User as PrismaUser } from '@prisma/client';
import type { Session } from 'lucia';

// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			status?: number;
			message?: string;
			description?: string;
		}
		interface Locals {
			user: (User & PrismaUser) | null;
			session: Session | null;
		}
		namespace Superforms {
			type Message = {
				success: boolean;
				message: string;
				description?: string;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
