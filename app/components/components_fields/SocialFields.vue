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
            :style="{ color : item.color }"
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
  {
    icon: '',
    link: '',
    color : '#000',
    classes: ''
  }
])

// Add social link
const addItem = () => {
  socials.value.push({
    icon: '',
    link: '',
    color : '#000',
    classes: ''
  })
}

// Remove social link
const removeItem = (index) => {
  if (socials.value.length > 1) {
    socials.value.splice(index, 1)
  } else {
    showErrorToast('At least one social link is required')
  }
}

// Submit
const handleSubmitSocials = () => {
  const invalid = socials.value.some(
    s => !s.icon || !s.link.trim()
  )

  if (invalid) {
    showErrorToast('Please select an icon and enter a link for each item')
    return
  }

  emit('handleSubmitFields', socials.value)
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
    .input{
      margin-bottom: 0;
    }
  }
}
</style>
