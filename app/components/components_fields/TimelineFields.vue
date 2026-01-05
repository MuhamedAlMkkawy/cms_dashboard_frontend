<template>
  <div class="timeline_fields">
    <h4 class="centered">Timeline</h4>

    <!-- Timeline Items -->
    <div
      class="timeline_item"
      v-for="(item, index) in timeline"
      :key="index"
    >
      <!-- Index -->
      <h6 class="item_index">
        Item <span>#{{ index + 1 }}</span>
      </h6>

      <div class="inputs">
        <!-- Icon -->
        <div class="input icon_input">
          <label>Icon</label>
          <button
            class="icon_select_btn"
            @click="emit('openIconPicker', item)"
          >
            <i :class="item.icon || 'pi pi-circle'"></i>
          </button>
        </div>
  
        <!-- Date -->
        <div class="input">
          <label>Date</label>
          <DatePicker v-model="item.date" />
        </div>
        <!-- Title -->
        <div class="input grow_input">
          <label>Title</label>
          <input
            type="text"
            v-model="item.title"
            placeholder="Timeline title"
          />
        </div>
      </div>


      <!-- Delete -->
      <button
        v-if="timeline.length > 1"
        class="delete_btn circled"
        @click="removeItem(index)"
      >
        <i class="pi pi-trash"></i>
      </button>

      <!-- Description -->
      <div class="input full_input">
        <label>Description</label>
        <textarea
          rows="3"
          v-model="item.description"
          placeholder="Timeline description..."
        ></textarea>
      </div>
    </div>

    <slot />

    <!-- Actions -->
    <div class="flex_buttons">
      <button class="main-btn reversed" @click="addItem">
        Add Item
      </button>
      <button class="main-btn" @click="handleSubmitTimeline">
        Submit
      </button>
    </div>
  </div>
</template>

<script setup>
const { showErrorToast } = useToastMsg()

const emit = defineEmits([
  'handleSubmitFields',
  'handleCloseComponentPopup',
  'openIconPicker'
])

const timeline = ref([
  {
    date: '',
    icon: '',
    title: '',
    description: '',
    classes: ''
  }
])

// Add item
const addItem = () => {
  timeline.value.push({
    date: '',
    icon: '',
    title: '',
    description: '',
    classes: ''
  })
}

// Remove item
const removeItem = (index) => {
  if (timeline.value.length > 1) {
    timeline.value.splice(index, 1)
  } else {
    showErrorToast('At least one timeline item is required')
  }
}

// Submit
const handleSubmitTimeline = () => {
  const invalid = timeline.value.some(
    i => !i.date || !i.title.trim() || !i.description.trim()
  )

  if (invalid) {
    showErrorToast('Please fill all timeline fields')
    return
  }

  emit('handleSubmitFields', timeline.value)
  emit('handleCloseComponentPopup')
}
</script>

<style scoped lang="scss">
.timeline_fields {
  text-align: start;

  .timeline_item {
    border: 1px solid #e4e4e4;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
    position: relative;
  }

  input{
    border: none ;
  }

  .inputs{
    display: flex;
    gap: 10px;
  }

}
</style>
