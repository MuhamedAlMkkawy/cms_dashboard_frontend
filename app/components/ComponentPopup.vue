<template>
  <div class="popup">
    <div class="content">
      <button
        class="pi pi-times close_btn"
        @click="$emit('handleCloseComponentPopup')"
      ></button>

      <!-- Dynamic component -->
      <component
        :is="componentMap[props.type]"
        @handleCloseComponentPopup="$emit('handleCloseComponentPopup')"
        @handleSubmitFields="handleFieldsSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import CardSliderFields from './fields/CardSliderFields.vue'
import MenuFields from './fields/MenuFields.vue'
// props for dynamic rendering
const props = defineProps({
  type: String // the component type name
})

// DEFINE EMITS
const emit = defineEmits(['handleCloseComponentPopup'])

// map type name to component
const componentMap = {
  'card-slider': CardSliderFields,
  'nav-menu' : MenuFields
}

// called when child emits handleSubmitFields
const handleFieldsSubmit = (data) => {
  emit('handleCloseComponentPopup')
  // console.log('Received data from field component:', data)
}
</script>

