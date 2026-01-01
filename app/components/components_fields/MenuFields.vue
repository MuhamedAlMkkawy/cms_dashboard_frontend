<template>
  <div class="nav_menu_fields">
    <h4 class="centered">Nav Menu</h4>

    <!-- -----------------------------
        LOOP PARENT + CHILD AS ONE UNIT
    ------------------------------ -->
    <div class="menu_group" v-for="(item, index) in body.items" :key="index">

      <!-- Parent -->
      <div class="menu_item">
        <div class="input">
          <label>Title</label>
          <input type="text" v-model="item.title" placeholder="Route title" />
        </div>

        <div class="input" v-if="!item?.checked">
          <label>Slug</label>
          <input type="text" v-model="item.slug" placeholder="Route slug" />
        </div>

        <div class="input toggle_input">
          <ToggleSwitch v-model="item.checked" @change="onToggle(index)" />
          <span>Has Childs</span>
        </div>

        <button
          v-if="body.items.length > 1"
          class="pi pi-trash delete_btn circled"
          @click="removeMenuItem(index)"
        ></button>
      </div>

      <!-- Childs Block -->
      <div v-if="item.checked" class="submenu_block">
        <h5></h5>
        <div class="submenu_item"
            v-for="(subItem, subIndex) in item.children"
            :key="`child-${index}-${subIndex}`">

          <div class="input">
            <label>Child Title</label>
            <input type="text" v-model="subItem.title" placeholder="Child title" />
          </div>

          <div class="input">
            <label>Child Slug</label>
            <input type="text" v-model="subItem.slug" placeholder="Child slug" />
          </div>

          <button
            v-if="item.children.length > 1"
            class="pi pi-trash delete_btn circled"
            @click="removeSubMenuItem(index, subIndex)"
          ></button>
        </div>

        <button class="main-btn reversed small_btn" @click="addSubMenuItem(index)">
          + Add Sub Menu
        </button>
      </div>

    </div>

    <slot></slot>

    <div class="flex_buttons">
      <button class="main-btn reversed" @click="addMenuItem">Add Menu Item</button>
      <button class="main-btn" @click="handleSubmitNavMenu">Submit</button>
    </div>
  </div>
</template>


<script setup>
const { showErrorToast } = useToastMsg();
const emit = defineEmits(["handleSubmitFields", "handleCloseComponentPopup"]);

// -----------------------------
// SETUP DEFAULT DATA MODEL
// -----------------------------
const body = ref({
  items: [{ title: "", slug: "", checked: false, children: [{title : "" , slug : ""}] }],
});

// -----------------------------
// ADD / REMOVE PARENT MENU ITEMS
// -----------------------------
const addMenuItem = () => {
  body.value.items.push({ title: "", slug: "", checked: false, children: [] });
};

const removeMenuItem = (index) => {
  if (body.value.items.length !== 1) {
    body.value.items.splice(index, 1);
  } else {
    showErrorToast("Menu should have at least one Route");
  }
};

// -----------------------------
// HANDLE HAS-CHILDS TOGGLE
// -----------------------------
const onToggle = (index) => {
  const item = body.value.items[index];
  if (item.checked) {
    if (!item.children) item.children = [];
    item.slug = "";
  } else {
    item.children = [{title : "" , slug : ""}];
  }
};

// -----------------------------
// HANDLE SUB MENU ITEMS
// -----------------------------
const addSubMenuItem = (index) => {
  body.value.items[index].children.push({ title: "", slug: "" });
};

const removeSubMenuItem = (i, sIndex) => {
  body.value.items[i].children.splice(sIndex, 1);
};

// -----------------------------
// HANDLE SUBMIT ACTION
// -----------------------------
const handleSubmitNavMenu = () => {
  const invalid = body.value.items.some((i) => {
    if (!i.title) return true;
    if (!i.checked && !i.slug) return true;
    if (i.checked && i.children.some((c) => !c.title || !c.slug)) return true;
  });

  if (invalid) {
    showErrorToast("Please fill all titles and slugs to continue");
    return;
  }

  emit("handleSubmitFields", body.value);
  emit("handleCloseComponentPopup");
};
</script>

<style scoped lang="scss">
.nav_menu_fields {
  .menu_item {
    display: flex;
    align-items: center;
    width: 100%;
    border: 1px solid #e4e4e4;
    padding-inline: 0 8px;
    border-radius: 8px;
    position: relative;
    &:not(:last-of-type) {
      margin-bottom: 18px;
    }
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

    input {
      padding: 6px 10px;
      border: 1px solid #e4e4e4;
      border-radius: 4px;
    }

    &.toggle_input {
      flex-direction: row;
      align-items: end;
      gap: 10px;
      justify-content: flex-end;
      width: fit-content;
      margin-inline-start: auto;
      flex-grow: 0;
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }

  .delete_btn {
    position: absolute;
    top: -10px;
    right: -5px;
  }
}

/* -----------------------------
   SUB MENU STYLE
------------------------------ */
.submenu_block {
  margin-top: 0px;
  padding-block: 24px;
  padding-inline: 20px;
  border-radius: 0 6px 6px;
  margin-bottom: 20px;
  position: relative;
  // background: #e4e4e4;
  h5 {
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 14px;
  }

  .submenu_item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    position: relative;
    border: 1px solid #e4e4e4;
  }

  .small_btn {
    font-size: 18px;
    padding: 5px 10px;
  }

  &::before{
    content: '';
    position: absolute;
    inset-inline-start: 8px;
    top: -15px;
    width: 1px;
    height: 80%;
    border: 0.5px dashed $secColor;
    border-radius: 8px;
    // background: red;
  }
}
</style>
