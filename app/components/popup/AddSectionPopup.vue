<template>
  <div class="popup">
    <div class="content">
      <button class="pi pi-times close_btn" @click="emit('handleShowAddSectionPopup')"></button>
      <h4>Section 's Name</h4>
      <div class="input">
        <input 
          type="text" 
          id="name" 
          placeholder="Name" 
          v-model="section.name" 
          @keydown.enter="handleSubmit"
        >
      </div>
      <button class="main-btn" @click="handleSubmit">Submit</button>
    </div>
  </div>
</template>

<script setup>
const {
  showErrorToast
} = useApiMethods()

const emit = defineEmits(['handleAddSection', 'handleShowAddSectionPopup']);

const section = ref({
  name: '',
  layout_items: 1,
  components: [],
  isDragOver: false,
});

const handleSubmit = () => {
  if (section.value.name.trim()) {
    emit('handleAddSection', section.value);
  }else{
    showErrorToast('You should Add the section Name to continue!')
  }
};
</script>

<style lang="scss" scoped>
</style>