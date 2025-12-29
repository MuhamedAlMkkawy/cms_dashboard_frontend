<template>
  <div class="popup">
    <div class="content">
      <button
        class="pi pi-times close_btn"
        @click="$emit('handleCloseComponentPopup')"
      ></button>

      <!-- Dynamic component -->
      <component
        :is="componentMap[type]"
        @handleSubmitFields="handleFieldsSubmit"
      />
    </div>
  </div>
</template>

<script setup>

// props for dynamic rendering
const props = defineProps({
  type: String // the component type name
})

// emit data back to parent
const emit = defineEmits(['handleCloseComponentPopup'])

// map type name to component
const componentMap = {
  'card-slider': CardSliderFields,
  // 'heading': HeadingFields,
  // 'gallery': GalleryFields,
  // add all other field components
}

// called when child emits handleSubmitFields
const handleFieldsSubmit = (data) => {
  console.log('Received data from field component:', data)
}
</script>

<style lang="scss" scoped>
// .popup {
//   .content {
//     padding: 20px;
//     background: #fff;
//     border-radius: 12px;
//     max-width: 600px;
//     margin: auto;
//   }
// }
</style>
