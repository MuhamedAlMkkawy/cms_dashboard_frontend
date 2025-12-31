<template>
  <div class="popup">
    <div class="content">
      <button class="pi pi-times close_btn" @click="emit('handleShowAddPagePopup')"></button>
      <h4>Page 's Name</h4>
      <div class="input">
        <input 
          type="text" 
          id="name" 
          placeholder="Name" 
          v-model="page.name" 
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

  const emit = defineEmits(['handleAddPage', 'handleShowAddPagePopup']);

  const page = ref({
    name: '',
  });

  const handleSubmit = () => {
    if (page.value.name.trim()) {
      emit('handleAddPage', page.value);
    }else{
      showErrorToast('You should Add the Page Name to continue!')
    }
  };
</script>
