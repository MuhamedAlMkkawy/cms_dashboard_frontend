import { defineStore } from 'pinia';


export const useAuthStore = defineStore('authStore', () => {
  const user = ref({
    token : null ,
    role : null
  });
  // const token = ref(null)


  const handleUserData = (newUser) => {
    // user.value = newUser;
    // console.log(newUser?.token)
    user.value.token = newUser?.token;
    user.value.role = newUser?.role;
  };

  return {
    user,
    // token,
    handleUserData
  };
}, {
  persist: {
    storage: {
      getItem: (key) => {
        const cookie = useCookie(key, { maxAge: 86400 }); // 1 day in seconds
        return cookie.value ? JSON.parse(cookie.value) : null;
      },
      setItem: (key, value) => {
        const cookie = useCookie(key, { maxAge: 86400 });
        cookie.value = JSON.stringify(value);
      },
      removeItem: (key) => {
        const cookie = useCookie(key);
        cookie.value = null;
      }
    }
  }
});
