<template>
  <div class="buttons_fields">
    <h4 class="centered">Buttons</h4>

    <!-- Loop through buttons -->
    <div class="button_item" v-for="(btn, index) in buttons" :key="index">

      <!-- Icon -->
      <div class="input icon_input">
        <label>Icon</label>
        <button class="icon_select_btn" @click="emit('openIconPicker', btn)">
          <i :class="btn.icon || 'pi pi-stop'"></i>
        </button>
      </div>

      <!-- Title -->
      <div class="input grow_input">
        <label>Button Title</label>
        <input type="text" v-model="btn.title" placeholder="Button title" />
      </div>

      <!-- Link -->
      <div class="input">
        <label>Button Link</label>
        <input type="text" v-model="btn.link" placeholder="Button link" />
      </div>

      <!-- Target -->
      <div class="input">
        <label>Target</label>
        <select v-model="btn.target">
          <option value="">Item Target</option>
          <option value="_self">Same Tab</option>
          <option value="_blank">New Tab</option>
        </select>
      </div>

      <!-- Reversed Switch -->
      <div class="input toggle_input">
        <ToggleSwitch v-model="btn.reversed" />
        <span>Reversed</span>
      </div>

      <!-- Delete button -->
      <button
        v-if="buttons.length > 1"
        class="delete_btn circled"
        @click="removeButton(index)"
      >
        <i class="pi pi-trash"></i>
      </button>
    </div>

    <slot></slot>

    <div class="flex_buttons">
      <button class="main-btn reversed" @click="addButton">Add Button</button>
      <button class="main-btn" @click="handleSubmitButtons">Submit</button>
    </div>

  </div>
</template>

<script setup>
const { showErrorToast } = useToastMsg();
const emit = defineEmits(["handleSubmitFields", "handleCloseComponentPopup", "openIconPicker"]);

const buttons = ref([
  { icon: "", title: "", link: "", target: "", reversed: false }
]);

// Add / Remove Buttons
const addButton = () => {
  buttons.value.push({ icon: "", title: "", link: "", target: "", reversed: false });
};

const removeButton = (index) => {
  if (buttons.value.length > 1) {
    buttons.value.splice(index, 1);
  } else {
    showErrorToast("At least one button is required");
  }
};

// Submit
const handleSubmitButtons = () => {
  const invalid = buttons.value.some((b) => !b.title || !b.link);
  if (invalid) {
    showErrorToast("Please fill all titles and links to continue");
    return;
  }
  emit("handleSubmitFields", buttons.value);
  emit("handleCloseComponentPopup");
};
</script>

<style scoped lang="scss">
.buttons_fields {
  .button_item {
    display: flex;
    align-items: center;
    gap: 10px;
    // border: 1px solid #e4e4e4;
    padding: 10px;
    border-radius: 8px;
    position: relative;
    // &:not(:last-of-type){
    //   margin-bottom: 6px;
    // }


  }

}
</style>
