<template>
  <div class="nav_menu_fields">
    <h4 class="centered">Nav Menu</h4>

    <!-- Menu Items -->
    <div class="menu_item" v-for="(item, index) in body.items" :key="index">
      <div class="input">
        <label>Title</label>
        <input type="text" v-model="item.title" placeholder="Route title" />
      </div>
      <div class="input">
        <label>Slug</label>
        <input type="text" v-model="item.slug" placeholder="Route slug" />
      </div>
      <button
        class="pi pi-trash delete_btn circled"
        @click="removeMenuItem(index)"
      ></button>
    </div>
    
    <ClassesInput 
      v-model="customClasses"
      id="custom_classes"
      label="CSS Classes"
      placeholder="e.g. rounded-lg shadow-md text-center"
    />

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
const emit = defineEmits(["handleSubmitFields", "handleCloseComponentPopup"]);

// default menu
const body = ref({
  items: [{ title: "", slug: "" }],
});

const customClasses = ref('')

// Add new menu item
const addMenuItem = () => {
  body.value.items.push({ title: "", slug: "" });
};

// Remove menu item
const removeMenuItem = (index) => {
  if(body.value.items.length !== 1){
    body.value.items.splice(index, 1);
  }else{
    showErrorToast('Menu should have at least one Route')
  }
};

// Submit nav menu
const handleSubmitNavMenu = () => {
  // validate: at least 1 menu with title and slug
  if (
    body.value.items.length === 0 ||
    body.value.items.some((i) => !i.title || !i.slug)
  ) {
    showErrorToast("Please fill all titles and slugs before submitting.");
    return;
  }else{
    // emit data
    emit("handleSubmitFields", {
      ...body.value,
      classes : customClasses.value
    }); // deep clone
    emit("handleCloseComponentPopup");
  }

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
  }
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
    .input-wrap {
      width: 100%;
    }
    input {
      padding: 6px 10px;
      border: 1px solid #e4e4e4;
      border-radius: 4px;
      // width: 150px;
    }

    .delete_btn {
      position: absolute;
      top: -10px;
      right: -5px;
    }
  }


  }
</style>
