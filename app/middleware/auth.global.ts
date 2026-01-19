import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuthStore } from "~/stores/authStore";
import { useGlobalStore } from "~/stores/globalStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const globalStore = useGlobalStore();
  const router = useRouter()


  const lang = globalStore.lang || "en";

  const authed = useCookie("authStore")?.value;
  // Redirect unauthenticated users to login
  if(authed){
    if (to.path.endsWith("/login")) {
      return router.push(`/${lang === "en" ? "" : lang}/`);
    }
  }else {
    if (!to.path.endsWith("/login")) {
      return router.push(`${lang === "en" ? "" : lang}/login`);
    }
    // Redirect logged-in users away from login page
  
    return;
  }
  
});
