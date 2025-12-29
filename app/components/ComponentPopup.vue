<template>
  <div class="popup">
    <div :class="['content ' , {max_width : props.type.toLowerCase().replace(/\s+/g, '-') === 'custom-html'} ]">
      <button
        class="pi pi-times close_btn"
        @click="$emit('handleCloseComponentPopup')"
      ></button>

      <!-- Dynamic component -->
      <component
        :is="componentMap[props.type.toLowerCase().replace(/\s+/g, '-')]"
        @handleCloseComponentPopup="$emit('handleCloseComponentPopup')"
        @handleSubmitFields="handleFieldsSubmit"
      />
    </div>
  </div>
</template>

<script setup>
  import CardSliderFields from './fields/CardSliderFields.vue'
  import CustomHtml from './fields/CustomHtml.vue'
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
    'nav-menu' : MenuFields,
    'custom-html' : CustomHtml
  }

  // called when child emits handleSubmitFields
  const handleFieldsSubmit = (data) => {
    emit('handleCloseComponentPopup')
    // console.log('Received data from field component:', data)
  }
</script>

