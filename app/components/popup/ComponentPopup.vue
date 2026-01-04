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
        @openIconPicker="openIconPicker"
        @handleSubmitFields="handleFieldsSubmit"
      >
      <ClassesInput
        v-model="customClasses"
        id="custom_classes"
        label="CSS Classes"
        placeholder="e.g. rounded-lg shadow-md text-center"
      />
    </component>
      <!-- Icon Picker -->
      <IconPicker v-model="iconPickerOpen" @select="setIcon" />
    </div>
  </div>
</template>

<script setup>
  import AccordionFields from '../components_fields/AccordionFields.vue'
  import ButtonsFields from '../components_fields/ButtonsFields.vue'
  import CardSliderFields from '../components_fields/CardSliderFields.vue'
  import CustomHtml from '../components_fields/CustomHtml.vue'
  import LogoField from '../components_fields/LogoField.vue'
  import MenuFields from '../components_fields/MenuFields.vue'
  import TimelineFields from '../components_fields/TimelineFields.vue'


  // props for dynamic rendering
  const props = defineProps({
    componentData : Object // the component data
  })

  // DEFINE CUSTOM CLASSES 
  const customClasses = ref('')


  // DEFINE EMITS
  const emit = defineEmits(['handleAddComponent' , 'handleCloseComponentPopup'])

  // map type name to component
  const componentMap = {
    'card-slider': CardSliderFields,
    'nav-menu' : MenuFields,
    'custom-html' : CustomHtml,
    'logo' : LogoField,
    'buttons' : ButtonsFields,
    'accordion' : AccordionFields,
    'timeline' : TimelineFields
  }


  // --------------------------
  // HANDLE THE ICON PICKER
  // --------------------------
  const iconPickerOpen = ref(false);
  const currentIconTarget = ref(null);

  const openIconPicker = (target) => {
    currentIconTarget.value = target;
    iconPickerOpen.value = true;
  };

  const setIcon = (icon) => {
    currentIconTarget.value.icon = icon;
  };


  // called when child emits handleSubmitFields
  const handleFieldsSubmit = (data) => {
    emit('handleAddComponent' , {
      sectionID : props.componentData.sectionID ,
      type : props.componentData.type ,
      content : {
        ...data ,
        customClasses : customClasses.value
      }
    })
    // emit('handleCloseComponentPopup')
  }
</script>

