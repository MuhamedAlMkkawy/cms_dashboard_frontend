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
      <img :src="body.image" alt="logo image" loading="lazy" preview />

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

    <button class="main-btn" @click="handleSubmitLogo">Submit</button>
  </div>
</template>

<script setup>
// --------------
// DEFINE EMITS
// --------------
const emit = defineEmits(["handleSubmitFields", "handleCloseComponentPopup"]);

// --------------
// HANDLE API METHODS
// --------------
const { submitMethod, submitResult, showErrorToast } = useApiMethods();

// --------------
// HANDLE BODY
// --------------
const body = ref({
  image: null,
  width: "",
  height: "",
});


  // ----------------------------
  // DEFINE PROPS
  // ----------------------------
  const props = defineProps({
    values: Object, // existing buttons data passed in
  });

  // -----------------------------
  // HANDLE VIEWING THE RENDERED VALUES
  // -----------------------------
  watch(
    () => props.values,
    (values) => {
      if (!values) return;

      body.value = {
        image: values.image ?? null,
        width: values.width ?? "",
        height: values.height ?? "",
      };
    },
    { immediate: true }
  );


// -------- HANDLE IMAGE UPLOAD ----------
const handleImageUpload = (e) => {
  const file = e.target.files?.[0];

  // 1️⃣ No file selected
  if (!file) {
    showErrorToast("No file selected");
    return;
  }

  // 2️⃣ Allowed image types (including SVG)
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ]

  if (!allowedTypes.includes(file.type)) {
    showErrorToast('Only JPG, PNG, WEBP, GIF, or SVG images are allowed')
    e.target.value = ''
    return
  }

  const formData = new FormData();
  formData.append("file", file);

  submitMethod("/uploads/single", false, formData, "POST", null);
};

watchEffect(() => {
  if (submitResult?.value) {
    body.value.image = submitResult?.value?.data?.path;
  }
});

const removeImage = () => {
  body.value.image = null;
};

// -------- SUBMIT ----------
const handleSubmitLogo = () => {
  if (!body.value.image) {
    showErrorToast("Logo image is required");
    return;
  }

  emit("handleSubmitFields", body.value);
  emit("handleCloseComponentPopup");
};
</script>

<style scoped lang="scss">
.logo_fields {
  /* 🔹 Layout override ONLY */
  .input {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 30px;

    label {
      flex-shrink: 0;
    }

    input {
      border: 0.5px solid #e4e4e4;
      max-width: 150px;
      padding: 8px 10px;
    }
  }

  /* 🔹 File upload button (component-specific) */
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

  /* 🔹 Image preview */
  .preview {
    margin-block: 10px;
    position: relative;
    max-width: 100px;
    height: 100px;
    border-radius: 4px;
    overflow: hidden;

    .delete_btn {
      position: absolute;
      top: 2px;
      right: 2px;
      font-size: 13px;
      cursor: pointer;
      border-radius: 4px;
    }
  }
}
</style>
