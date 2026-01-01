<template>
  <div class="nav_menu_fields">
    <h4 class="centered">Nav Menu</h4>

    <!-- -----------------------------
        LOOP PARENT + CHILD AS ONE UNIT
    ------------------------------ -->
    <div class="menu_group" v-for="(item, index) in body.items" :key="index">

      <!-- Parent -->
      <div :class="['menu_item ' , {has_childs : item?.checked}]">
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
        <div class="submenu_block_header">
          <h5 v-if="item?.title">Sub Menu for: <span>{{ item.title }}</span></h5>
          <button class="add_sub_menu" @click="addSubMenuItem(index)">
            <i class="pi pi-plus"></i>
          </button>
        </div>
        <div class="submenu_item"
            v-for="(subItem, subIndex) in item.children"
            :key="`child-${index}-${subIndex}`">
          <h4>( {{ subIndex+1 }} ) </h4>
          <div class="input">
            <label>Sub Menu Title</label>
            <input type="text" v-model="subItem.title" placeholder="Sub Menu title" />
          </div>

          <div class="input">
            <label>Sub Menu Slug</label>
            <input type="text" v-model="subItem.slug" placeholder="Sub Menu slug" />
          </div>

          <button
            v-if="item.children.length > 1"
            class="pi pi-trash delete_btn circled"
            @click="removeSubMenuItem(index, subIndex)"
          ></button>
        </div>
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
    &.has_childs{
      margin-bottom: 0px;
    }
  }

  .input {
    display: flex;
    flex-direction: column;
    align-items: start;
    flex-grow: 1;
    border: none;
    margin-bottom: 0;
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
  padding-inline: 20px;
  border-radius: 0 6px 6px;
  position: relative;
  padding-block: 10px 4px;
  max-height: 160px;
  overflow-y: scroll;
  margin-bottom: 20px;
  &::-webkit-scrollbar{
    width: 2px;
  }
  .submenu_block_header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    h5 {
      font-weight: 600;
      font-size: 14px;
      text-align: start;
      span{
        color: $secColor
      }
    }
    .add_sub_menu{
      @include circle(35px , 4px);
      margin-inline-start: auto;
      background: $mainColor;
      color: #fff;
      border: 1px solid $mainColor;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.4s;
      &:hover{
        background: #fff;
        color: $mainColor;
      }
    }
  }

  .submenu_item {
    display: flex;
    align-items: center;
    position: relative;
    border: 1px solid #e4e4e4;
    h4{
      font-size: 14px;
      padding-inline: 10px 0;
    }
    border-radius: 5px;
    &:not(:last-of-type){
      margin-bottom: 18px;
    }
  }

  &::before{
    content: '';
    position: absolute;
    inset-inline-start: 8px;
    top: 0px;
    width: 1px;
    height: 100%;
    border: 0.5px dashed $secColor;
    border-radius: 8px;
    // background: red;
  }
}
</style>
