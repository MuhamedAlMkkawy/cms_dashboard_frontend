<template>
  <div class="project_page page">
    <div class="side_bar">
      <div class="header_image">
        <button class="back_btn" @click="$router.back()">
          <i class="pi pi-angle-left"></i>
        </button>
        <div class="image">
          <img src="@/assets/images/logo.png" alt="logo_image" loading="lazy" />
        </div>
      </div>
      <hr />
      <div class="components">
        <div
          v-for="item in sidebarComponents"
          :key="item.type"
          class="component_item"
          draggable="true"
          @dragstart="onDragStart(item, $event)"
          @dragend="onDragEnd($event)"
        >
          <i :class="item.icon" class="component_icon" />
          <span class="component_title">{{ item.label }}</span>
          <i class="pi pi-equals"></i>
        </div>
      </div>
      <hr />
      <div class="header_image">
        <div class="image">
          <img src="@/assets/images/board.svg" alt="logo_image" loading="lazy" />
        </div>
      </div>
    </div>
    <div class="project_content">
      <div class="pages">
        <div
          v-for="i in 8"
          :key="i"
          :class="['page_item', { active: activePage === i }]"
          @click="activePage = i"
        >
          <span>Home</span>
          <Button
            type="button"
            icon="pi pi-ellipsis-v"
            @click.stop="(event) => menu[i - 1].toggle(event)"
            aria-haspopup="true"
            :aria-controls="`overlay_menu_${i}`"
          />
          <Menu
            ref="menu"
            :id="`overlay_menu_${i}`"
            :model="items"
            :popup="true"
          />
        </div>
        <button class="add_page">
          <i class="pi pi-plus"></i>
        </button>
      </div>
    </div>
    <hr />
    <div class="project_sections">
      <div
        v-for="section in sections"
        :key="section.id"
        class="section"
      >
        <div class="section_header">
          <h3 class="section_title">{{ section.name }}</h3>
          <div class="buttons">
            <!-- layout design button -->
            <button
              class="layout_design section_control"
              @click="changeLayout(section)"
            >
              <i
                class="pi pi-stop"
                v-for="i in (section.layout_items === 3 ? 1 : section.layout_items === 1 ? 2 : 3)"
                :key="i"
              ></i>
            </button>

            <button class="section_control pi pi-pen-to-square"></button>
            <button class="section_control pi pi-eye"></button>
          </div>
        </div>

        <hr />

        <div :class="['content_items', `items_${section.layout_items}`]">
          <div
            v-for="(slot, index) in getSlotsCount(section)"
            :key="index"
            class="content_item section_component"
            :class="{ 'drag-over': section.isDragOver }"
            @dragover.prevent
            @dragenter="onDragEnter(section, $event)"
            @dragleave="onDragLeave(section, $event)"
            @drop="onDrop(section)"
          >
            <!-- Slot contains a component -->
            <template v-if="section.components[index]">
              <div class="section_block" @click="componentType = section.components[index].type">
                <div class="section_info">
                  <i :class="section.components[index].icon"></i>
                  <span>{{ section.components[index].label }}</span>
                </div>

              </div>
              <button class="remove_component" @click.stop="removeComponent(section, index)">
                <i class="pi pi-trash"></i>
              </button>
            </template>

            <!-- Empty slot -->
            <template v-else>
              <div class="section_component empty_placeholder active">
                Drag components here
              </div>
            </template>
          </div>
        </div>

      </div>
      <div 
        class="section add_section" 
        @click="showAddSectionPopup = true"
      >
        <i class="pi pi-plus"></i>
      </div>
    </div>
    <!-- ################## Add Section Popup ##################-->
    <AddSectionPopup
      v-if="showAddSectionPopup"
      @handleShowAddSectionPopup="showAddSectionPopup = false"
      @handleAddSection="handleAddSection"
    />
    <!-- ################# Add Section  Popup #####################-->
    <!-- ############## Add Component Content  Popup ##############-->
    <ComponentPopup 
    v-if="componentType"
    :type="componentType"
    @handleCloseComponentPopup="componentType = null"
    />
    <!-- ############## Add Component Content  Popup ##############-->
  </div>
</template>

<script setup>
// ----------------------------
// HANDLE PAGE ITEM 'S MENU
// ----------------------------
const activePage = ref(1);

// -----------------------------
// HANDLE SIDE BAR 'S COMPONENTS
// -----------------------------
const sidebarComponents = [
  {
    type: "card-slider",
    label: "Card slider",
    icon: "pi pi-sliders-h",
  },
  {
    type: "nav-menu",
    label: "Nav menu",
    icon: "pi pi-bars",
  },
  {
    type: "alert",
    label: "Alert",
    icon: "pi pi-exclamation-triangle",
  },
  {
    type: "description-list",
    label: "Description list",
    icon: "pi pi-list",
  },
  {
    type: "divider",
    label: "Divider",
    icon: "pi pi-minus",
  },
  {
    type: "call-to-action",
    label: "Call to action",
    icon: "pi pi-phone",
  },
  {
    type: "card",
    label: "Card",
    icon: "pi pi-id-card",
  },
  {
    type: "pricing-list",
    label: "Pricing list",
    icon: "pi pi-tags",
  },
  {
    type: "data-tables",
    label: "Data tables",
    icon: "pi pi-table",
  },
  {
    type: "buttons",
    label: "Buttons",
    icon: "pi pi-clone",
  },
  {
    type: "modal-module",
    label: "Modal module",
    icon: "pi pi-window-maximize",
  },
  {
    type: "gallery",
    label: "Gallery",
    icon: "pi pi-images",
  },
  {
    type: "timeline",
    label: "Time line",
    icon: "pi pi-clock",
  },
  {
    type: "social-media",
    label: "Social media",
    icon: "pi pi-share-alt",
  },
  {
    type: "custom-html",
    label: "custom HTML",
    icon: "pi pi-code",
  },
  {
    type: "heading",
    label: "Heading",
    icon: "pi pi-info-circle",
  },
  {
    type: "accordion",
    label: "Accordion",
    icon: "pi pi-align-justify",
  },
  {
    type: "contact-info",
    label: "Contact Info",
    icon: "pi pi-envelope",
  },
  {
    type: "tabs",
    label: "Tabs",
    icon: "pi pi-folder-open",
  },
  {
    type: "logo",
    label: "Logo",
    icon: "pi pi-star",
  },
  {
    type : 'language',
    label : 'Language',
    icon : 'pi pi-language'
  },
  {
    type: "back-to-top",
    label: "Back to top",
    icon: "pi pi-arrow-up",
  },
];

// ----------------------------
// HANDLE PAGE ITEM 'S MENU
// ----------------------------
const menu = ref();
const items = ref([
  {
    label: "Options",
        items: [
      {
        label: "Hide",
        icon: "pi pi-eye",
        command: () => {
          router.push("/introduction");
        },
      },
      {
        label: "Delete",
        icon: "pi pi-trash",
        command: () => {
          router.push("/introduction");
        },
      },
      {
        label: "Edit",
        icon: "pi pi-pen-to-square",
        command: () => {
          router.push("/introduction");
        },
      },
    ],
  },
]);


// ----------------------------
// HANDLE SECTION DESIGN
// ----------------------------
const sections = ref([
  {
    id: 1,
    name: "Header",
    layout_items: 1,
    components: [], // { type, label, icon }
    isDragOver: false,
  },
]);


// -------------------------
// HANDLE ADD NEW SECTION
// -------------------------
const handleAddSection = (section) => {
  sections.value.push({
    id : sections.length,
    ...section
  })
  showAddSectionPopup.value = false
}


const getSlotsCount = (section) => {
  return section.components.length + 1;  // always add 1 empty slot
};


// ------------------------------
// HANDLE DRAG & DROP COMPONENTS
// ------------------------------
const draggedComponent = ref(null);

const isDragging = ref(false);

const onDragStart = (item, e) => {
  draggedComponent.value = item;
  isDragging.value = true;
  e.dataTransfer.effectAllowed = "move";
  e.target.classList.add("dragging");
};

const onDragEnd = (e) => {
  draggedComponent.value = null;
  isDragging.value = false;
  e.target.classList.remove("dragging");
};


const onDragEnter = (section, e) => {
  section.isDragOver = true;

  // Get ONLY the empty placeholder inside THIS slot
  const placeholder = e.currentTarget.querySelector('.empty_placeholder');
  if (placeholder && draggedComponent.value) {
    placeholder.classList.add("is-dragging");
  }
};

const onDragLeave = (section, e) => {
  section.isDragOver = false;

  const placeholder = e.currentTarget.querySelector('.empty_placeholder');
  if (placeholder) {
    placeholder.classList.remove("is-dragging");
  }
};



const onDrop = (section) => {
  if (!draggedComponent.value) return;

  section.components.push({
    id: Date.now(),
    ...draggedComponent.value
  });

  draggedComponent.value = null;
  section.isDragOver = false;
};


// ---------------------------
// HANDLE REMOVE THE COMPONENT
// ---------------------------
const removeComponent = (section, index) => {
  section.components.splice(index, 1);
};

// ---------------------------
// HANDLE ADD THE COMPONENT CONENT
// ---------------------------
const componentType = ref(null)


// ----------------------------
// HANDLE CHANGE SECTION LAYOUT
// ----------------------------
const changeLayout = (section) => {
  section.layout_items =
    section.layout_items < 3
      ? section.layout_items + 1
      : 1
}

// ----------------------------
// HANDLE ADD SECTION POPUP
// ----------------------------
const showAddSectionPopup = ref(false)

watchEffect(()=> {
  console.log(sections.value)
})
</script>

<style lang="scss" scoped>
.project_page {
  margin-inline-start: 250px;
  padding-inline: 20px;

  .pages {
    @include displayFlex($justify: start, $gap: 10px);
    margin-bottom: 25px;
    
    .page_item {
      background: #e4e4e450;
      color: $mainColor;
      padding: 5px 10px;
      display: flex;
      align-items: center;
      gap: 15px;
      border-radius: 8px;
      transition: 0.3s;
      cursor: pointer;
      button {
        background: transparent;
        border: none;
        color: inherit;
        transform: rotate(90deg);
      }
      &:not(.active):hover {
        background: #e4e4e4;
      }
      &.active {
        background: $mainColor;
        color: #fff;
      }
      + .add_page {
        margin-inline-start: auto;
        @include circle(40px);
        border: 1px solid $mainColor;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $mainColor;
        transition: 0.6s;
        i.pi {
          font-size: 15px;
          font-weight: 600;
          color: inherit;
        }
        &:hover {
          background: $mainColor;
          color: #fff;
        }
      }
    }
    + hr {
      background: #333;
      height: 3px;
    }
  }
}

</style>
