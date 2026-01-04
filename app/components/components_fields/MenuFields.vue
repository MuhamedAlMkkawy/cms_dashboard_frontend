<template>
  <div class="nav_menu_fields">
    <h4 class="centered">Nav Menu</h4>

    <!-- -----------------------------
        LOOP PARENT + CHILD AS ONE UNIT
    ------------------------------ -->
    <div class="menu_group" v-for="(item, index) in body.items" :key="index">

      <!-- Parent -->
      <div :class="['menu_item ' , {has_childs : item?.hasChilds}]">
        <div class="input icon_input">
          <label>Icon</label>

          <button class="icon_select_btn" @click="emit('openIconPicker' , item)">
            <i :class="item.icon || 'pi pi-stop'"></i>
            <!-- <span>{{ item.icon ? 'Change Icon' : 'Choose Icon' }}</span> -->
          </button>
        </div>

        <div class="input">
          <label>Title</label>
          <input type="text" v-model="item.title" placeholder="Route title" />
        </div>

        <div class="input" v-if="!item?.hasChilds">
          <label>link</label>
          <input type="text" v-model="item.link" placeholder="Route link" />
        </div>

        <div class="input" v-if="!item.hasChilds">
          <label>Target</label>
          <select v-model="item.target">
            <option value="">Item Target</option>
            <option value="_self">Same Tab</option>
            <option value="_blank">New Tab</option>
          </select>
        </div>

        <div class="input toggle_input">
          <ToggleSwitch v-model="item.hasChilds" @change="onToggle(index)" />
          <span>Has Childs</span>
        </div>

        <button
          v-if="body.items.length > 1"
          class="pi pi-trash delete_btn circled"
          @click="removeMenuItem(index)"
        ></button>
      </div>

      <!-- Childs Block -->
      <div v-if="item.hasChilds" class="submenu_block">
        <div class="submenu_block_header">
          <h5>Sub Menu for: <span>{{ item.title }}</span></h5>
          <button class="add_sub_menu" @click="addSubMenuItem(index)">
            <i class="pi pi-plus"></i>
          </button>
        </div>
        <div class="submenu_item"
            v-for="(subItem, subIndex) in item.children"
            :key="`child-${index}-${subIndex}`">
          <!-- <h4>( {{ subIndex+1 }} ) </h4> -->

          <div class="icon_input input">
            <label for="icon">icon</label>
            <button class="icon_select_btn" @click="openIconPicker(subItem)">
              <i :class="subItem.icon || 'pi pi-stop'"></i>
            </button>
          </div>

          <div class="input">
            <label>Sub Menu Title</label>
            <input type="text" v-model="subItem.title" placeholder="Sub Menu title" />
          </div>

          <div class="input">
            <label>Sub Menu link</label>
            <input type="text" v-model="subItem.link" placeholder="Sub Menu link" />
          </div>


          <div class="input" v-if="!subItem.hasChilds">
            <label>Sub Menu Target</label>
            <select v-model="subItem.target">
              <option value="">Item Target</option>
              <option value="_self">Same Tab</option>
              <option value="_blank">New Tab</option>
            </select>
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

<!--     
  <IconPicker
    v-model="iconPickerOpen"
    @select="setIcon"
  /> -->

  </div>
</template>


<script setup>
const { showErrorToast } = useToastMsg();
const emit = defineEmits(["handleSubmitFields", "handleCloseComponentPopup" , "openIconPicker"]);

// -----------------------------
// SETUP DEFAULT DATA MODEL
// -----------------------------
const body = ref({
  items: [
    { 
      icon : "",
      title: "", 
      link: "", 
      target : "" , 
      hasChilds: false, 
      children: [
        {
          icon : "",
          title : "" , 
          link : "",
          target : ""
        }
      ]
    }
  ],
});

// -----------------------------
// ADD / REMOVE PARENT MENU ITEMS
// -----------------------------
const addMenuItem = () => {
  body.value.items.push(
    { 
      title: "", 
      link: "", 
      target : "" , 
      hasChilds: false, 
      children: [] 
    }
  );
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
  if (item.hasChilds) {
    if (!item.children) item.children = [];
    item.link = "";
  } else {
    item.children = [{title : "" , link : "" , target : ""}];
  }
};

// -----------------------------
// HANDLE SUB MENU ITEMS
// -----------------------------
const addSubMenuItem = (index) => {
  body.value.items[index].children.push({ title: "", link: "" , target : ""});
};

const removeSubMenuItem = (i, sIndex) => {
  body.value.items[i].children.splice(sIndex, 1);
};



// -----------------------------
// HANDLE THE ICON PICKER POPUP
// -----------------------------
// const iconPickerOpen = ref(false);
// const currentIconTarget = ref(null);


// const openIconPicker = (target) => {
//   currentIconTarget.value = target;
//   iconPickerOpen.value = true;
// };

// const setIcon = (icon) => {
//   currentIconTarget.value.icon = icon;
// };

// -----------------------------
// HANDLE SUBMIT ACTION
// -----------------------------
const handleSubmitNavMenu = () => {
  const invalid = body.value.items.some((i) => {
    if (!i.title) return true;
    if (!i.hasChilds && !i.link) return true;
    if (i.hasChilds && i.children.some((c) => !c.title || !c.link)) return true;
  });

  if (invalid) {
    showErrorToast("Please fill all titles and links to continue");
    return;
  }

  emit("handleSubmitFields", body.value);
  emit("handleCloseComponentPopup");
};
</script>

<style scoped lang="scss">
.nav_menu_fields {
  .menu_group{
    
    &:not(:last-of-type) {
      margin-bottom: 18px;
    }
    .menu_item {
      display: flex;
      align-items: center;
      width: 100%;
      border: 1px solid #e4e4e4;
      padding-inline: 0 8px;
      border-radius: 8px;
      position: relative;
      
      &.has_childs{
        margin-bottom: 0px;
        border-radius: 6px 6px 0 0;
        padding-inline: 10px;
      }
    }
  }

  .input {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    border: none;
    flex-grow: 1;
    margin-bottom: 0;
    label {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
      text-align: start;
      width: 100%;
    }
    &:first-of-type{
      label{
        text-align: center;
      }
    }

    input,
    select {
      padding: 6px;
      border: 1px solid #e4e4e4;
      border-radius: 4px;
    }

    select{
      font-size: 14px;
    }
    

    &.toggle_input {
      flex-direction: row;
      align-items: end;
      gap: 10px;
      justify-content: flex-end;
      width: fit-content;
      margin-inline-start: auto;
      flex-shrink: 0;
      padding-bottom: 0;
      margin-bottom: 0;
    }


  }
  .icon_input{
    flex-grow: 0;
    .icon_select_btn{
      border: 1px solid #e4e4e4;
      padding: 6px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      transition: 0.3s;
      flex-grow: unset;
      max-width: 55px;
      &:hover{
        background: #e4e4e4;
      }
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
  // padding-inline: 20px 8px;
  padding-inline: 15px;
  border-radius: 0 0px 6px 6px;
  position: relative;
  padding-block: 10px 14px;
  max-height: 160px;
  overflow-y: scroll;
  margin-bottom: 20px;
  counter-reset: submenu-counter; // initialize the counter
  box-shadow: 0 1px 10px #e4e4e4;
  &::-webkit-scrollbar{
    width: 2px;
  }
  .submenu_block_header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
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
    gap: 4px;
    position: relative;
    border: 1px solid #e4e4e4;
    border-radius: 5px;
    padding-inline: 35px 8px; // leave space for the number
    margin-bottom: 18px;

    h4 {
      font-size: 14px;
      padding: 10px 0;
    }

    // Only add margin-bottom if it's not the last item
    &:last-of-type {
      margin-bottom: 0;
    }

    // Pseudo-element for showing order
    &::before {
      content: counter(submenu-counter);
      counter-increment: submenu-counter;
      position: absolute;
      left: 10px;
      bottom: 0;
      // top: 50%;
      // transform: translateY(-50%);
      font-size: 40px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.1); // faded background look
      z-index: 0;
    }
  }

  // &::before{
  //   content: '';
  //   position: absolute;
  //   inset-inline-start: 8px;
  //   top: 0px;
  //   width: 1px;
  //   height: 100%;
  //   border: 0.5px dashed $secColor;
  //   border-radius: 8px;
  //   // background: red;
  // }
}
</style>
