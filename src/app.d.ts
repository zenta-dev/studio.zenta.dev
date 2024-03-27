// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { User } from "$lib/types/user";
import "@poppanator/sveltekit-svg/dist/svg";
import type { TechModel } from "./lib/server/prisma";

declare global {
  namespace App {
    interface Error {
      status?: number;
      message?: string;
      description?: string;
    }
    interface Locals {
      user: User | null;
      session: import("lucia").Session | null;
    }

    interface PageData {
      tech?: TechModel[];
    }
    // interface PageState {}
  }
}

export {};
