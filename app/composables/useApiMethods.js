import { useRouter } from 'vue-router';
import { useGlobalStore } from '@/stores/globalStore';
import { useAuthStore } from '@/stores/authStore';
import { useToastMsg } from '@/composables/useToastMsg';
import { fetchApiData , submitApiForm } from '@/composables/useApiFetch';
import { ref } from 'vue';

export function useApiMethods() {
  // define global store
  const globalStore = useGlobalStore();

  // define auth store
  const authStore = useAuthStore();

  // define route
  const route = useRoute();

  // define router
  const router = useRouter();

  // define local route
  const localeRoute = useLocaleRoute()

  // define useToastMsg
  const { 
    showErrorToast, 
    showSuccessToast,
    showInfoToast,
    showWarnToast 
  } = useToastMsg();


  // define handle the next route 
  const handleNextRoute = (nextRoute) => {
    setTimeout(()=>{
      if(nextRoute == 'reload_page'){
        router.go(0);
      }else{
        router.push(localeRoute(nextRoute));
      }
    } , 500)
  }


  // define handle the toast message and its type
  const handleToastMsg = (type , message) => {
    // to stop the loading while showing the message
    globalStore.switchLoading(false);
    if(type == 'success'){
      showSuccessToast(message);
    }else if(type == 'info'){
      showInfoToast(message);
    }else if(type == 'warn'){
      showWarnToast(message);
    }else{
      showErrorToast(message);
    }
  }

  // Fetch Data 
  const getResult = ref(null);
  const getMethod = async (apiUrl , pageNumber ,authed , showToast) => {
    globalStore.switchLoading(true);
    getResult.value = null

    console.log(apiUrl)
    const { data, error } = await fetchApiData(`${apiUrl}${pageNumber ? `${apiUrl.includes('?') ? '&' : '?'}page=${pageNumber}` : ''}`, authed);

    // ${authStore?.userData ? `?device_id=${globalStore.device_id}&` : apiUrl.startsWith('search?') ? '&' : '?' }
    if (error) {
      handleToastMsg('error' , error?.response?._data?.message)
      if(
        error?.response?._data?.status == 'unauthenticated'||
        error?.response?._data?.status == 'unauthorized'||
        error?.response?._data?.status == 'not_approved' ||
        error?.response?._data?.status == 'blocked'
      ){
        setTimeout(() => {
          location.reload()
        }, 500);
        useCookie('authStore').value = ''
        window.sessionStorage.clear();
      }
    } else {
      if (data.status == 'success') {
        getResult.value = data;
      }
      else if (
        data.status == 'unauthenticated' ||
        data.status == 'unauthorized' ||
        data.status == 'not_approved' ||
        data.status == 'blocked'
      ) {
        setTimeout(() => {
          location.reload()
        }, 500);
        useCookie('authStore').value = ''
        window.sessionStorage.clear();
      }
      if(showToast){
        handleToastMsg(data?.status , data?.message)
      }
      globalStore.switchLoading(false)
    }
  }


  // submit form function
  const submitResult = ref(null)
  const submitMethod = async (endPoint, authed , payload , method  , nextRoute , refetchApi) => {
    globalStore.switchLoading(true);
    const {data , error} = await submitApiForm(endPoint, authed ,  payload , method);
    
    if (error) {
      handleToastMsg('error' , error?.response?._data?.message)
      if(
        error?.response?._data?.status == 'unauthenticated'||
        error?.response?._data?.status == 'unauthorized'||
        error?.response?._data?.status == 'not_approved' ||
        error?.response?._data?.status == 'blocked'
      ){
        useCookie('authStore').value = ''
        window.sessionStorage.clear();
        setTimeout(() => {
          handleNextRoute('/auth/login')
        }, 500);
      }
      else if(error?.response?._data?.status == 'needActive'){
        setTimeout(() => {
          handleNextRoute('/auth/activation_code')
        }, 500);
      }
    } else {
      if (nextRoute) {
        handleNextRoute(nextRoute);
      }
      if (refetchApi) {
        getMethod(refetchApi , '' , authStore ? true : false , false)
      }
      // if (data.status == 'success' || data.status == 'needActive') {
      //   if(
      //     endPoint == 'activate' || 
      //     endPoint == 'signin' || 
      //     endPoint == 'notify' || 
      //     endPoint == 'update-provider-profile'
      //   ){
      //     // console.log(data?.data)
      //     useCookie('authStore').value = data?.data
      //     window.sessionStorage.setItem('authStore' , JSON.stringify(data?.data))
      //     // authStore.handleUserData(data.data);
      //   }
      // }
      // else if (
      //   data.status == 'unauthenticated' || 
      //   data.status == 'not_approved'
      // ){
      //   handleNextRoute('/')
      //   useCookie('authStore').value = ''
      //   window.sessionStorage.clear();
      // }
      // else if(data?.status == 'needActive'){
      //   setTimeout(() => {
      //     handleNextRoute('/auth/activation_code')
      //   }, 500);
      // }
      submitResult.value = data;
      handleToastMsg(data?.status , data?.message)
      globalStore.switchLoading(false)
    }
  };  

  return {
    getMethod,
    getResult,
    submitMethod,
    submitResult,
    showErrorToast,
    handleNextRoute
  };
}