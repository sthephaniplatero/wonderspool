import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // rutas relativas: funciona en usuario.github.io/repo/ y en dominio propio
  build: { target: 'esnext' },
});
