<template>
  <ul class="languages-switch" :style="'direction: ' + locale.code === 'ar' ? 'rtl' : 'ltr'" >
    <NuxtLink 
      v-for="locale in availableLocales" 
      :key="locale.code" 
      :to="switchLocalePath(locale.code)"
      @click="useGlobalStore().setLang(locale.code)"
    >
    <span>{{ locale.name }}</span>
    <i class="pi pi-globe"></i>
    </NuxtLink>
    </ul>
</template>

<script setup>
  const { locale, locales } = useI18n()
  const switchLocalePath = useSwitchLocalePath()


  const availableLocales = computed(() => {
    return locales.value.filter(i => i.code !== locale.value)
  })
</script>

<style lang="scss" scoped>
  .languages-switch {
    position: relative;
    padding: 4px 8px;
    position: fixed;
    inset-inline-start: 50px;
    bottom: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.5s;
    i.pi {
      color: #fff;
      font-size: 18px;
    }

    a {
      @include displayFlex($gap: 5px, $direction: row, $justify: flex-start);
      padding: 3px 5px;
      height: 30px;
      overflow: hidden;
      cursor: pointer;
      // padding-inline-end: 20px;
      span {
        font-size: clamp(14px, 2.5vw, 20px);
      }
    }
    &:hover{
      a{
        color: $mainColor;
        border-radius: 4px;
        background:#fff;
      }
      i.pi{
        color: $mainColor;
      }
    }
  }
</style>
