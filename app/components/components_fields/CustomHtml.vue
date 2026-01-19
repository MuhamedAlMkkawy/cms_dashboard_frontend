<template>
  <div class="custom_html_fields">
    <h4 class="centered">{{ $t("customHtml.title") }}</h4>

    <!-- HTML QUILL EDITOR -->
    <Editor v-model="body.html" :placeholder="$t('customHtml.placeholder')" />

    <slot></slot>

    <button class="main-btn" @click="handleSubmitHtml">
      {{ $t("customHtml.submit") }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const { showErrorToast } = useToastMsg();

// ---------------
// DEFINE EMITS
// ---------------
const emit = defineEmits(["handleSubmitFields", "handleCloseComponentPopup"]);

// ----------------
// DEFINE EDITOR DATA
// ----------------
const body = ref({
  html: "",
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
    body.value.html = values.html;
  },
  { immediate: true }
);

// ----------------
// HANDLE SUBMIT
// ----------------
const handleSubmitHtml = () => {
  if (!body.value.html.trim()) {
    showErrorToast(t("customHtml.emptyError"));
    return;
  }

  emit("handleSubmitFields", body.value);
  emit("handleCloseComponentPopup");
};
</script>

<style scoped lang="scss">
.custom_html_fields {
  max-height: 700px;
  overflow-y: scroll;
  .input {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    label {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 6px;
    }
  }

  // .editor_input {
  //   width: 100%;
  //   max-width: unset;
  //   :deep(.p-editor-container) {
  //     width: 100%;
  //     border-radius: 6px;
  //     border: 1px solid #e4e4e4;

  //     &:focus-within {
  //       border-color: $mainColor;
  //     }
  //   }
  // }
}
</style>
