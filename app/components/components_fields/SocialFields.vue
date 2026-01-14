<template>
  <div class="social_links_fields">
    <h4 class="centered">Social Links</h4>

    <!-- Social Items -->
    <div
      class="social_item"
      v-for="(item, index) in socials"
      :key="index"
    >
      <!-- Icon -->
      <div class="input icon_input">
        <label>Icon</label>
        <button
          type="button"
          class="icon_select_btn"
          @click="emit('openIconPicker', item)"
        >
          <i
            :class="item.icon || 'pi pi-share-alt'"
            :style="{ color: item.color + ' !important' }"
          ></i>
        </button>
      </div>

      <!-- Color -->
      <div class="input icon_input">
        <label for="color">Color</label>
        <input type="color" name="color" v-model="item.color" id="color">
      </div>

      <!-- Link -->
      <div class="input grow_input">
        <label>Link</label>
        <input
          type="url"
          v-model="item.link"
          placeholder="https://example.com"
        />
      </div>

      <!-- Delete -->
      <button
        v-if="socials.length > 1"
        class="delete_btn circled"
        @click="removeItem(index)"
      >
        <i class="pi pi-trash"></i>
      </button>
    </div>

    <slot />

    <!-- Actions -->
    <div class="flex_buttons">
      <button class="main-btn reversed" @click="addItem">
        Add Link
      </button>
      <button class="main-btn" @click="handleSubmitSocials">
        Submit
      </button>
    </div>
  </div>
</template>

<script setup>
const { showErrorToast } = useToastMsg()

const emit = defineEmits([
  'handleSubmitFields',
  'handleCloseComponentPopup',
  'openIconPicker'
])

const socials = ref([
  { icon: '', link: '', color: '#000000' }
])

// ----------------------------
// DEFINE PROPS FOR EXISTING DATA
// ----------------------------
const props = defineProps({
  values: Object, 
})

// -----------------------------
// RENDER DATA FROM PROPS
// -----------------------------
watch(
  () => props.values,
  (values) => {
    if (!values) return

    socials.value =
      values?.items?.map((item) => ({
        icon: item.icon ?? '',
        link: item.link ?? '',
        color: item.color ?? '#000000',
      }))
  },
  { immediate: true }
)

// -----------------------------
// ADD / REMOVE ITEMS
// -----------------------------
const addItem = () => {
  socials.value.push({ icon: '', link: '', color: '#000000' })
}

const removeItem = (index) => {
  if (socials.value.length > 1) {
    socials.value.splice(index, 1)
  } else {
    showErrorToast('At least one social link is required')
  }
}

// -----------------------------
// SUBMIT ITEMS
// -----------------------------
const handleSubmitSocials = () => {
  const invalid = socials.value.some(s => !s.link.trim())
  if (invalid) {
    showErrorToast('Please enter a link for each item')
    return
  }

  // Map socials and omit `icon` if empty
  const submittedItems = socials.value.map((s) => {
    const itemData = {
      link: s.link.trim(),
      color: s.color ?? '#000000',
    }
    if (s.icon?.trim()) {
      itemData.icon = s.icon.trim()
    }
    return itemData
  })

  emit('handleSubmitFields', {items : submittedItems})
  emit('handleCloseComponentPopup')
}
</script>

<style scoped lang="scss">
.social_links_fields {
  text-align: start;

  .social_item {
    display: flex;
    align-items: stretch;
    gap: 10px;
    border: 1px solid #e4e4e4;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
    position: relative;

    .input {
      margin-bottom: 0;
    }
  }
}
</style>
