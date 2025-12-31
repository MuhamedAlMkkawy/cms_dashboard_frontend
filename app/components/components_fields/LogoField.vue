<template>
  <div class="logo_fields">
    <h4 class="centered">Logo Component</h4>

    <!-- Upload Logo -->
    <div class="input upload_logo">
      <input
        type="file"
        accept="image/*"
        id="logo_input"
        hidden
        @change="handleImageUpload"
      />
      <label for="logo_input" class="upload_logo_btn">
        <i class="pi pi-upload"></i>
        <span>Upload Logo</span>
      </label>
    </div>

    <!-- Preview -->
    <div v-if="body.image" class="preview">
      <Image :src="body.image.url" alt="logo image" loading="lazy" preview />

      <button class="pi pi-trash delete_btn" @click="removeImage"></button>
    </div>

    <!-- width -->
    <div class="input">
      <label for="logo_width">Width (px)</label>
      <input
        id="logo_width"
        type="number"
        v-model="body.width"
        class="input-wrap"
        placeholder="Example: 150"
      />
    </div>

    <!-- height -->
    <div class="input">
      <label for="logo_height">Height (px)</label>
      <input
        id="logo_height"
        type="number"
        v-model="body.height"
        class="input-wrap"
        placeholder="Example: 50"
      />
    </div>

    <!-- CSS classes -->
    <slot></slot>

  
    <button class="main-btn" @click="handleSubmitLogo">
      Submit
    </button>
  </div>
</template>

<script setup>
  // --------------
  // DEFINE EMITS
  // --------------
  const emit = defineEmits(["handleSubmitFields", "handleCloseComponentPopup"])
  
  
  // --------------
  // HANDLE ERROR TOAST
  // --------------
  const { showErrorToast } = useToastMsg()

  // --------------
  // HANDLE BODY
  // --------------
  const body = ref({
    image: null,
    width: "",
    height: "",
  })

// -------- HANDLE IMAGE UPLOAD ----------
const handleImageUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  body.value.image = {
    url: URL.createObjectURL(file),
    file
  }
}

const removeImage = () => {
  body.value.image = null
}

// -------- SUBMIT ----------
const handleSubmitLogo = () => {
  if (!body.value.image) {
    showErrorToast("Logo image is required")
    return
  }

  emit("handleSubmitFields", body.value)
  emit("handleCloseComponentPopup")
}
</script>

<style scoped lang="scss">
.logo_fields {
  .input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
    label{
      flex-shrink: 0;
    }
    .input-wrap {
      border: 1px solid #e4e4e4;
      border-radius: 4px;
      max-width: 400px;
      width: 100%;
      height: 38px;
      padding: 0 10px;
      font-size: 14px;
    }
  }

  label.upload_logo_btn {
    border: 1px dashed #e4e4e4;
    border-radius: 6px;
    padding: 12px;
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      margin-inline-start: 8px;
      font-size: 14px;
    }

    &:hover {
      color: $mainColor;
      border-color: $mainColor;
    }
  }

  .preview {
    margin-block: 10px;
    position: relative;
    max-width: 100px;
    border-radius: 4px;
    overflow: hidden;
    height: 100px;

    .delete_btn {
      position: absolute;
      top: 2px;
      right: 2px;
      padding: 5px;
      font-size: 13px;
      cursor: pointer;
      border-radius: 4px;
    }
  }
}
</style>
