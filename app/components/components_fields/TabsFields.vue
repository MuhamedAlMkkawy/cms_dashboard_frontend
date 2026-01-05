<template>
  <div class="tabs_fields">
    <h4 class="centered">Tabs Fields</h4>

    <!-- Tabs Items -->
    <div
      class="tab_item"
      v-for="(tab, index) in tabs"
      :key="index"
    >
      <div class="item_index">
        Tab <span># {{ index + 1 }}</span>
      </div>

      <div class="tab_header">
        <!-- Title -->
        <div class="input grow_input">
          <label>Tab Title</label>
          <input type="text" v-model="tab.title" placeholder="Tab title" />
        </div>

        <!-- Delete -->
        <button
          v-if="tabs.length > 1"
          class="delete_btn circled"
          @click="removeTab(index)"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="input full_input">
        <label>Tab Description</label>
        <textarea
          rows="4"
          v-model="tab.description"
          placeholder="Tab description..."
        ></textarea>
      </div>
    </div>

    <slot />

    <!-- Actions -->
    <div class="flex_buttons">
      <button class="main-btn reversed" @click="addTab">Add Tab</button>
      <button class="main-btn" @click="handleSubmitTabs">Submit</button>
    </div>
  </div>
</template>

<script setup>
const { showErrorToast } = useToastMsg()
const emit = defineEmits(["handleSubmitFields", "handleCloseComponentPopup"])

const tabs = ref([
  {
    title: "",
    description: "",
  },
])

// Add tab
const addTab = () => {
  tabs.value.push({
    title: "",
    description: "",
  })
}

// Remove tab
const removeTab = (index) => {
  if (tabs.value.length > 1) {
    tabs.value.splice(index, 1)
  } else {
    showErrorToast("At least one tab is required")
  }
}

// Submit tabs
const handleSubmitTabs = () => {
  const invalid = tabs.value.some(
    t => !t?.title?.trim() || !t?.description?.trim()
  )
  if (invalid) {
    showErrorToast("Please fill all tab titles and descriptions")
    return
  }
  emit("handleSubmitFields", tabs.value)
  emit("handleCloseComponentPopup")
}
</script>

<style scoped lang="scss">
.tabs_fields {
  .tab_item {
    margin-bottom: 12px;
    padding: 10px;
    border: 1px solid #e4e4e4;
    border-radius: 8px;
    background: #fff;
    position: relative;

    .tab_header {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .toggle_input {
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .item_index {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 6px;
      span {
        color: $secColor;
      }
    }
  }

  .flex_buttons {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
}
</style>
