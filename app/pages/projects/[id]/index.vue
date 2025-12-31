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
          <i :class="['pi ', item.icon]" class="component_icon" />
          <span class="component_title">{{ item.label }}</span>
          <i class="pi pi-equals"></i>
        </div>
      </div>
      <hr />
      <div class="header_image">
        <div class="image">
          <img
            src="@/assets/images/board.svg"
            alt="logo_image"
            loading="lazy"
          />
        </div>
      </div>
    </div>
    <div class="project_content">
      <div class="pages">
        <div
          v-for="page in pages"
          :key="page"
          :class="[
            'page_item',
            { active: activePage === page?.id, hidden: !page.visible },
          ]"
          @click="activePage = page?.id"
        >
          <span>{{ page?.name }}</span>
          <Button
            type="button"
            icon="pi pi-ellipsis-v"
            @click.stop="(event) => menu[page?.id - 1].toggle(event)"
            aria-haspopup="true"
            :aria-controls="`${page?.id}`"
          />
          <Menu
            ref="menu"
            :id="`${page.id}_0_0`"
            :model="getPageMenuItems(page.id)"
            :popup="true"
          />
        </div>
        <button class="add_page" @click="showAddPagePopup = true">
          <i class="pi pi-plus"></i>
        </button>
      </div>
    </div>
    <hr />
    <div class="project_sections">
      <div
        v-for="section in currentPage?.sections"
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
                v-for="i in section.layout_items === 3
                  ? 1
                  : section.layout_items === 1
                  ? 2
                  : 3"
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
              <div class="section_block">
                <div class="section_info">
                  <i :class="section.components[index].icon"></i>
                  <span>{{ section.components[index].label }}</span>
                </div>
              </div>
              <button
                class="section_button control_component"
                @click="
                  handleSectionContent(
                    section.id,
                    section.components[index].type
                  )
                "
              >
                <i class="pi pi-pen-to-square"></i>
              </button>
              <button
                class="section_button remove_component"
                @click.stop="removeComponent(section, index)"
              >
                <i class="pi pi-trash"></i>
              </button>
            </template>

            <!-- Empty slot -->
            <template v-else>
              <div class="section_component empty_placeholder">
                Drag components here
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="section add_section" @click="showAddSectionPopup = true">
        <i class="pi pi-plus"></i>
        <span>Add Section</span>
      </div>
      <button class="main-btn savePageButton" @click="handleSavePageContent">
        Save
      </button>
    </div>
    <!-- ################## Add Section Popup ##################-->
    <AddSectionPopup
      v-if="showAddSectionPopup"
      @handleShowAddSectionPopup="showAddSectionPopup = false"
      @handleAddSection="handleAddSection"
    />
    <!-- ################# Add Section  Popup #####################-->
    <!-- ################## Add Page Popup ##################-->
    <AddPagePopup
      v-if="showAddPagePopup"
      @handleShowAddPagePopup="showAddPagePopup = false"
      @handleAddPage="handleAddPage"
    />
    <!-- ################# Add Page  Popup #####################-->
    <!-- ############## Add Component Content  Popup ##############-->
    <ComponentPopup
      v-if="componentData.type"
      :componentData="componentData"
      @handleCloseComponentPopup="componentData = {}"
      @handleAddComponent="handleAddComponentContent"
    />
    <!-- ############## Add Component Content  Popup ##############-->
  </div>
</template>

<script setup>
// -----------------------------
// HANDLE ERROR TOAST
// -----------------------------
const { showErrorToast } = useToastMsg();

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
    icon: "pi-images",
  },
  {
    type: "timeline",
    label: "Time line",
    icon: "pi-clock",
  },
  {
    type: "social-media",
    label: "Social media",
    icon: "pi-share-alt",
  },
  {
    type: "custom-html",
    label: "custom HTML",
    icon: "pi-code",
  },
  {
    type: "heading",
    label: "Heading",
    icon: "pi-info-circle",
  },
  {
    type: "accordion",
    label: "Accordion",
    icon: "pi-align-justify",
  },
  {
    type: "contact-info",
    label: "Contact Info",
    icon: "pi-envelope",
  },
  {
    type: "tabs",
    label: "Tabs",
    icon: "pi-folder-open",
  },
  {
    type: "logo",
    label: "Logo",
    icon: "pi-star",
  },
  {
    type: "language",
    label: "Language",
    icon: "pi-language",
  },
  {
    type: "back-to-top",
    label: "Back to top",
    icon: "pi-arrow-up",
  },
];

// ----------------------------
// HANDLE PAGE ITEM 'S MENU
// ----------------------------
const menu = ref()
const getPageMenuItems = (pageId) => [
  {
    label: "Options",
    items: [
      {
        label: pages.value.find((p) => p.id === pageId)?.visible ? "Hide" : "Show",
        icon: pages.value.find((p) => p.id === pageId)?.visible ? "pi pi-eye-slash" : "pi pi-eye",
        command: () => handleHidePage(pageId),
      },
      // {
      //   label: "Delete",
      //   icon: "pi pi-trash",
      //   command: () => router.push("/introduction"),
      // },
      {
        label: "Edit",
        icon: "pi pi-pen-to-square",
        command: () => router.push("/introduction"),
      },
    ]
  }
];


// ----------------------------
// HANDLE PAGES CONTENT
// ----------------------------
const pages = ref([
  {
    id: 1,
    name: "home",
    visible: true,
    sections: [],
  },
]);

// ----------------------------
// HANDLE ACTIVE PAGE
// ----------------------------
const activePage = ref(1);
const currentPage = computed(() =>
  pages.value.find((p) => p.id === activePage.value)
);

// ----------------------------
// HANDLE ADD SECTION POPUP
// ----------------------------
const showAddSectionPopup = ref(false);

const handleAddSection = (section) => {
  currentPage.value.sections.push({
    id: currentPage?.value?.sections?.length + 1,
    ...section,
  });
  showAddSectionPopup.value = false;
};

const getSlotsCount = (section) => {
  return section.components.length + 1; // always add 1 empty slot
};

// ----------------------------
// HANDLE ADD PAGE POPUP
// ----------------------------
const showAddPagePopup = ref(false);

const handleAddPage = (page) => {
  pages?.value?.push({
    id: pages?.value?.length + 1,
    name: page?.name,
    visible: true,
    sections: [],
  });
  showAddPagePopup.value = false;
};

const handleHidePage = (id) => {
  const targetPage = pages?.value?.find(item => item.id === id)
  targetPage.visible = !targetPage.visible
};

// ------------------------------
// HANDLE DRAG & DROP COMPONENTS
// ------------------------------
const draggedComponent = ref(null);

const isDragging = ref(false);

const onDragStart = (item, e) => {
  draggedComponent.value = structuredClone(item); // CLONE DATA
  isDragging.value = true;

  // Create custom preview node
  const clone = e.target.cloneNode(true);
  clone.style.width = `${e.target.offsetWidth}px`;
  clone.style.height = `${e.target.offsetHeight}px`;
  clone.classList.add("drag-preview");
  clone.style.position = "fixed";
  clone.style.top = "-9999px";

  document.body.appendChild(clone);
  e.dataTransfer.setDragImage(clone, 0, 0);

  e.target.classList.add("dragging");
};

const onDragEnd = (e) => {
  draggedComponent.value = null;
  isDragging.value = false;
  e.target.classList.remove("dragging");

  const ghost = document.querySelector(".drag-preview");
  if (ghost) ghost.remove();
};

const onDragEnter = (section, e) => {
  section.isDragOver = true;
  const placeholder = e.currentTarget.querySelector(".empty_placeholder");
  if (placeholder && draggedComponent.value) {
    placeholder.classList.add("is-dragging");
  }
};

const onDragLeave = (section, e) => {
  section.isDragOver = false;
  const placeholder = e.currentTarget.querySelector(".empty_placeholder");
  if (placeholder) placeholder.classList.remove("is-dragging");
};

const onDrop = (section) => {
  if (!draggedComponent.value) return;

  // Add new component to this section
  section.components.push({
    id: Date.now(),
    ...draggedComponent.value,
  });

  draggedComponent.value = null;
  section.isDragOver = false;
};

// ---------------------------
// HANDLE ADD THE COMPONENT POPUP
// ---------------------------
const componentData = ref({});

const removeComponent = (section, index) => {
  section.components.splice(index, 1);
};

const handleSectionContent = (sectionID, type) => {
  componentData.value.sectionID = sectionID;
  componentData.value.type = type;
};

const handleAddComponentContent = (data) => {
  // 1️⃣ Find section
  const targetedSection = currentPage?.value.sections.find(
    (item) => item.id == data.sectionID
  );
  if (!targetedSection) return showErrorToast("Section not found");

  // 2️⃣ Find component inside section
  const targetComponent = targetedSection.components.find(
    (comp) => comp.type === data.type
  );
  if (!targetComponent) return showErrorToast("Component not found");

  // 3️⃣ Add / replace content
  targetComponent.content = data.content;
};

// ----------------------------
// HANDLE CHANGE SECTION LAYOUT
// ----------------------------
const changeLayout = (section) => {
  section.layout_items =
    section.layout_items < 3 ? section.layout_items + 1 : 1;
};

// ----------------------------
// HANDLE SAVE PAGE CONTENT
// ----------------------------
const handleSavePageContent = () => {
  console.log(pages.value);
};
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
      text-transform: capitalize;
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
      &.hidden {
        background: $textColor;
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
  button.savePageButton {
    margin-top: auto;
  }
}
</style>
