<template>
  <div class="nav_menu_fields">
    <h4 class="centered">Nav Menu</h4>

    <!-- Menu Items -->
    <div class="menu_item" v-for="(item, index) in menu.items" :key="index">
      <div class="input">
        <label>Title</label>
        <input type="text" v-model="item.title" placeholder="Menu title" />
      </div>
      <div class="input">
        <label>Slug</label>
        <input type="text" v-model="item.slug" placeholder="Menu slug" />
      </div>
      <button
        class="pi pi-trash delete_btn circled"
        @click="removeMenuItem(index)"
      ></button>
    </div>

    <div class="flex_buttons">
      <!-- Add New Menu Item -->
      <button class="main-btn reversed" @click="addMenuItem">Add Menu Item</button>
  
      <!-- Submit Button -->
      <button class="main-btn" @click="handleSubmitNavMenu">Submit</button>
    </div>
  </div>
</template>

<script setup>
const { showErrorToast } = useToastMsg()
// define emits 
const emit = defineEmits(["handleFieldsSubmit", "handleCloseComponentPopup"]);

// default menu
const menu = ref({
  items: [{ title: "", slug: "" }],
});

// Add new menu item
const addMenuItem = () => {
  menu.value.items.push({ title: "", slug: "" });
};

// Remove menu item
const removeMenuItem = (index) => {
  if(menu.value.items.length !== 1){
    menu.value.items.splice(index, 1);
  }
};

// Submit nav menu
const handleSubmitNavMenu = () => {
  // validate: at least 1 menu with title and slug
  if (
    menu.value.items.length === 0 ||
    menu.value.items.some((i) => !i.title || !i.slug)
  ) {
    showErrorToast("Please fill all titles and slugs before submitting.");
    return;
  }

  // emit data
  emit("handleFieldsSubmit", JSON.parse(JSON.stringify(menu.value))); // deep clone
  emit("handleCloseComponentPopup");
};
</script>

<style lang="scss" scoped>
.nav_menu_fields {
  .menu_item {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 18px;
    border: 1px solid #e4e4e4;
    padding-inline: 0 12px;
    border-radius: 8px;
    position: relative;
    .input {
      display: flex;
      flex-direction: column;
      align-items: start;
      flex-grow: 1;
      border: none;
      label {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 4px;
      }
      input {
        padding: 6px 10px;
        border: 1px solid #e4e4e4;
        border-radius: 4px;
        // width: 150px;
      }
    }

    .delete_btn {
      position: absolute;
      top: -10px;
      right: -5px;
    }
  }


  }
</style>
