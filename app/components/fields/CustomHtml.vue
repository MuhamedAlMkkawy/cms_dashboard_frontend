<template>
  <div class="custom_html_fields">
    <h4 class="centered">Custom HTML Section</h4>
    <!-- HTML QUILL EDITOR -->
    <Editor
      v-model="htmlData.html"
      placeholder="Write or paste HTML here..."
    />
    <!-- <div class="input editor_input">
    </div> -->

    <button class="main-btn" @click="handleSubmitHtml">
      Submit
    </button>
  </div>
</template>

<script setup>  
import Editor from 'primevue/editor';

const { showErrorToast } = useToastMsg()
const emit = defineEmits(["handleFieldsSubmit", "handleCloseComponentPopup"])

const htmlData = ref({
  hasContainer: false,
  html: ""
})

const handleSubmitHtml = () => {
  if (!htmlData.value.html.trim()) {
    showErrorToast("HTML content cannot be empty")
    return
  }

  const payload = new FormData()
  payload.append("hasContainer", htmlData.value.hasContainer)
  payload.append("html", htmlData.value.html)

  emit("handleFieldsSubmit", payload)
  emit("handleCloseComponentPopup")
}
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
