<template>
  <div class="popup">
    <div :class="['content ' , {max_width : props.componentData.type.toLowerCase().replace(/\s+/g, '-') === 'custom-html'} ]">
      <button
        class="pi pi-times close_btn"
        @click="$emit('handleCloseComponentPopup')"
      ></button>

      <!-- Dynamic component -->
      <component
        :is="componentMap[props.componentData.type.toLowerCase().replace(/\s+/g, '-')]"
        @handleCloseComponentPopup="emit('handleCloseComponentPopup')"
        @handleSubmitFields="handleFieldsSubmit"
      />
      
    </div>
  </div>
</template>

<script setup>
  import CardSliderFields from './fields/CardSliderFields.vue'
  import CustomHtml from './fields/CustomHtml.vue'
  import LogoField from './fields/LogoField.vue'
  import MenuFields from './fields/MenuFields.vue'


  // props for dynamic rendering
  const props = defineProps({
    componentData : Object // the component data
  })


  // DEFINE EMITS
  const emit = defineEmits(['handleAddComponent' , 'handleCloseComponentPopup'])

  // map type name to component
  const componentMap = {
    'card-slider': CardSliderFields,
    'nav-menu' : MenuFields,
    'custom-html' : CustomHtml,
    'logo' : LogoField
  }



  // called when child emits handleSubmitFields
  const handleFieldsSubmit = (data) => {
    emit('handleAddComponent' , {
      sectionID : props.componentData.sectionID ,
      type : props.componentData.type ,
      content : {...data}
    })
    // emit('handleCloseComponentPopup')
  }
</script>

