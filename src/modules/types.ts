import type { Component } from "vue";

export interface CipherProvider {
  id: string;
  name: string;
  description: string;
  route: string;
  component: Component;
}

