<template>
  <div class="popup">
    <div class="content">
      <button
        class="pi pi-times close_btn"
        @click="handleClose"
      ></button>

      <h4>Section Name</h4>

      <div class="input">
        <input
          type="text"
          placeholder="Name"
          v-model.trim="section.name"
          @keydown.enter="handleSubmit"
        />
      </div>

      <button class="main-btn" @click="handleSubmit">
        Submit
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const { showErrorToast } = useApiMethods()

/* ------------------------
 * EMITS
 * ------------------------ */
const emit = defineEmits([
  'handleSectionPopup',
  'handleShowControlSectionPopup'
])

/* ------------------------
 * PROPS (edit mode optional)
 * ------------------------ */
const props = defineProps({
  modifiedSection: {
    type: Object,
    default: null
  }
})

/* ------------------------
 * STATE
 * ------------------------ */
const section = ref({
  name: '',
  visible: true,
  layout_items: 1,
  components: [],
  isDragOver: false
})

/* ------------------------
 * WATCH EDIT MODE
 * ------------------------ */
watch(
  () => props.modifiedSection,
  (val) => {
    if (!val) return

    section.value = {
      name: val.name ?? '',
      visible: val.visible ?? true,
      layout_items: val.layout_items ?? 1,
      components: val.components ?? [],
      isDragOver: false
    }
  },
  { immediate: true }
)

/* ------------------------
 * METHODS
 * ------------------------ */
const handleSubmit = () => {
  if (!section.value.name) {
    showErrorToast('You should add the section name to continue!')
    return
  }

  emit('handleSectionPopup', section.value )

  handleClose()
}

const handleClose = () => {
  section.value = {
    name: '',
    visible: true,
    layout_items: 1,
    components: [],
    isDragOver: false
  }

  emit('handleShowControlSectionPopup')
}
</script>
