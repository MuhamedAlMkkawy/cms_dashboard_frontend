<template>
  <div class="accordion_fields">
    <h4 class="centered">Accordion</h4>

    <!-- Accordion Items -->
    <div
      class="accordion_item"
      v-for="(item, index) in accordions"
      :key="index"
    >
    <h6 class="item_index">Item <span>#{{ index+1 }}</span></h6>
      <!-- Title -->
      <div class="input grow_input">
        <label>Title</label>
        <input
          type="text"
          v-model="item.title"
          placeholder="Accordion title"
        />
      </div>

      <!-- Delete -->
      <button
        v-if="accordions.length > 1"
        class="delete_btn circled"
        @click="removeAccordion(index)"
      >
        <i class="pi pi-trash"></i>
      </button>

      <!-- Content -->
      <div class="input full_input">
        <label>Content</label>
        <textarea
          rows="4"
          v-model="item.content"
          placeholder="Accordion content..."
        ></textarea>
      </div>
    </div>

    <slot />

    <!-- Actions -->
    <div class="flex_buttons">
      <button class="main-btn reversed" @click="addAccordion">
        Add Item
      </button>
      <button class="main-btn" @click="handleSubmitAccordion">
        Submit
      </button>
    </div>
  </div>
</template>

<script setup>
  const { showErrorToast } = useToastMsg()

  const emit = defineEmits([
    "handleSubmitFields",
    "handleCloseComponentPopup"
  ])

  const accordions = ref([
    {
      title: "",
      content: "",
    }
  ])

  // Add accordion
  const addAccordion = () => {
    accordions.value.push({
      title: "",
      content: "",
    })
  }

  // Remove accordion
  const removeAccordion = (index) => {
    if (accordions.value.length > 1) {
      accordions.value.splice(index, 1)
    } else {
      showErrorToast("At least one accordion item is required")
    }
  }

  // Submit
  const handleSubmitAccordion = () => {
    const invalid = accordions.value.some(
      a => !a.title.trim() || !a.content.trim()
    )

    if (invalid) {
      showErrorToast("Please fill all accordion titles and contents")
      return
    }

    emit("handleSubmitFields", accordions.value)
    emit("handleCloseComponentPopup")
  }
</script>

<style scoped lang="scss">
.accordion_fields {
  .accordion_item {
    border: 1px solid #e4e4e4;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
    position: relative;
    text-align: start;
  }

  .accordion_index {
    font-size: 13px;
    font-weight: 600;
    color: #666;
    margin-bottom: 6px;
  }

  textarea {
    resize: vertical;
    min-height: 90px;
  }
}


</style>
