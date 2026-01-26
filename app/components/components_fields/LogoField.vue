<template>
  <div class="logo_fields">
    <h4 class="centered">{{ $t("logo.title") }}</h4>

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
        <span>{{ $t("logo.upload") }}</span>
      </label>
    </div>

    <!-- Preview -->
    <div v-if="body.image" class="preview">
      <img
        :src="useRuntimeConfig().public.apiBase+body.image"
        :alt="$t('logo.previewAlt')"
        loading="lazy"
        preview
      />
      <button class="pi pi-trash delete_btn" @click="removeImage"></button>
    </div>

    <!-- width -->
    <div class="input">
      <label for="logo_width">{{ $t("logo.widthLabel") }}</label>
      <input
        id="logo_width"
        type="number"
        v-model="body.width"
        class="input-wrap"
        :placeholder="$t('logo.widthPlaceholder')"
      />
    </div>

    <!-- height -->
    <div class="input">
      <label for="logo_height">{{ $t("logo.heightLabel") }}</label>
      <input
        id="logo_height"
        type="number"
        v-model="body.height"
        class="input-wrap"
        :placeholder="$t('logo.heightPlaceholder')"
      />
    </div>

    <!-- CSS classes slot -->
    <slot></slot>

    <button class="main-btn" @click="handleSubmitLogo">
      {{ $t("logo.submit") }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

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

  if (!file) {
    showErrorToast(t("logo.noFile"));
    return;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ];

  if (!allowedTypes.includes(file.type)) {
    showErrorToast(t("logo.invalidFile"));
    e.target.value = "";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  submitMethod("/uploads/single", true , formData, "POST", null);
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
    showErrorToast(t("logo.imageRequired"));
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
