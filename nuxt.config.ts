import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/fonts",
    "@nuxt/hints",
    "@nuxt/image",
    "@nuxt/icon",
    "@nuxt/scripts",
    "shadcn-nuxt",
    "@pinia/nuxt",
  ],
  nitro: {
    preset: "bun",
    compressPublicAssets: false,
    minify: true,
  },

  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: "./app/components/ui",
  },
  experimental: {
    typedPages: true,
  },
  routeRules: {
    "/": { redirect: "/auth/login" },
  },
});
