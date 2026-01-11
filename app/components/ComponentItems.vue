<template>
  <div class="components">
    <div
      v-for="item in getResult?.data ?? []"
      :key="item.type"
      class="component_item"
      draggable="true"
      @dragstart="handleDragStart(item, $event)"
      @dragend="handleDragEnd($event)"
    >
      <i :class="['component_icon pi', item.icon]" />
      <span class="component_title">{{ item.label }}</span>
      <i class="pi pi-equals"></i>
    </div>
  </div>
</template>

<script setup>
const { getMethod, getResult } = useApiMethods()

// 👇 MATCH PARENT EVENT NAMES EXACTLY
const emit = defineEmits(['onDragStart', 'onDragEnd'])

const handleDragStart = (item, e) => {
  // REQUIRED for drag to work
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('application/json', JSON.stringify(item))

  emit('onDragStart', item, e)
}

const handleDragEnd = (e) => {
  emit('onDragEnd', e)
}

onMounted(() => {
  getMethod('components', null, false, false)
})
</script>
