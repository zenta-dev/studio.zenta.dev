// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { User } from "$lib/types/user";

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

    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
