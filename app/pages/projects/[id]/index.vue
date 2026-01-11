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
      <ComponentItems
        draggable="true"
        @onDragStart="onDragStart"
        @onDragEnd="onDragEnd"
      />
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
            { active: activePage === page?.id, hidden_element: !page.visible },
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
        <button class="add_page" @click="showControlPagePopup = true">
          <i class="pi pi-plus"></i>
        </button>
      </div>
    </div>
    <hr />
    <div class="project_sections">
      <div
        v-for="section in currentPage?.sections"
        :key="section.id"
        :class="['section ', { hidden_element: !section.visible }]"
      >
        <div class="section_header">
          <h3 class="section_title">{{ section.name }}</h3>
          <div class="buttons">
            <!-- layout design button -->
            <button
              class="layout_design section_control"
              v-if="section.visible"
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

            <button
              v-if="section.visible"
              @click="handleEditSection(section)"
              class="section_control pi pi-pen-to-square"
            ></button>
            <button
              @click="section.visible = !section.visible"
              :class="[
                'section_control pi',
                `pi-eye${section.visible ? '' : '-slash'}`,
              ]"
            ></button>
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
                  <i :class="['pi ', section.components[index].icon]"></i>
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
      <div class="section add_section" @click="showControlSectionPopup = true">
        <i class="pi pi-plus"></i>
        <span>Add Section</span>
      </div>
      <button class="main-btn savePageButton" @click="handleSavePageContent">
        Save
      </button>
    </div>
    <!-- #################### Add Section Popup ###################-->
    <ControlSectionPopup
      v-if="showControlSectionPopup"
      :modifiedSection="modifiedSection"
      @handleShowControlSectionPopup="showControlSectionPopup = false"
      @handleSectionPopup="handleSectionPopup"
    />
    <!-- ################# Add Section  Popup #####################-->
    <!-- ##################### Add Page Popup #####################-->
    <ControlPagePopup
      v-if="showControlPagePopup"
      :modifiedPage="modifiedPage"
      @handleShowControlPagePopup="showControlPagePopup = false"
      @handleControlPage="handleControlPage"
    />
    <!-- ################### Add Page  Popup ######################-->
    <!-- ############## Add Component Content  Popup ##############-->
    <ComponentPopup
      v-if="componentData.type"
      :componentData="componentData"
      @handleCloseComponentPopup="componentData = {}"
      @handleAddComponentContent="handleAddComponentContent"
    />
    <!-- ############## Add Component Content  Popup ##############-->
  </div>
</template>

<script setup>
// -----------------------------
// HANDLE ERROR TOAST
// -----------------------------
const { showErrorToast } = useToastMsg();

// ----------------------------
// HANDLE PAGE ITEM 'S MENU
// ----------------------------
const menu = ref();
const getPageMenuItems = (pageId) => [
  {
    label: "Options",
    items: [
      {
        label: pages.value.find((p) => p.id === pageId)?.visible
          ? "Hide"
          : "Show",
        icon: pages.value.find((p) => p.id === pageId)?.visible
          ? "pi pi-eye-slash"
          : "pi pi-eye",
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
        command: () => handleEditPage(pageId),
        visible: pages.value.find((p) => p.id === pageId)?.visible,
      },
    ],
  },
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
const modifiedSection = ref(null);
const showControlSectionPopup = ref(false);

const handleSectionPopup = (section) => {
  if (modifiedSection.value) {
    // EDIT MODE
    const targetSection = currentPage.value.sections.find(
      (item) => item.id === modifiedSection.value.id
    );

    if (targetSection) {
      targetSection.name = section.name;
      targetSection.visible = section.visible;
      targetSection.layout_items = section.layout_items;
      targetSection.components = section.components;
    }
  } else {
    // ADD MODE
    currentPage.value.sections.push({
      id: currentPage.value.sections.length + 1,
      ...section,
    });
  }

  showControlSectionPopup.value = false;
  modifiedSection.value = null;
};

const handleEditSection = (section) => {
  modifiedSection.value = section;
  showControlSectionPopup.value = true;
};

const getSlotsCount = (section) => {
  return section.components.length + 1; // always add 1 empty slot
};

// ----------------------------
// HANDLE ADD PAGE POPUP
// ----------------------------
const modifiedPage = ref();
const showControlPagePopup = ref(false);

const handleControlPage = (page) => {
  if (modifiedPage.value) {
    const targetPage = pages?.value?.find(
      (item) => item.id === modifiedPage.value.id
    );
    targetPage.name = page?.name;
  } else {
    pages?.value?.push({
      id: pages?.value?.length + 1,
      name: page?.name,
      visible: true,
      sections: [],
    });
  }
  showControlPagePopup.value = false;
};

const handleHidePage = (id) => {
  const targetPage = pages?.value?.find((item) => item.id === id);
  targetPage.visible = !targetPage.visible;
};

const handleEditPage = (id) => {
  showControlPagePopup.value = true;
  const targetPage = pages?.value?.find((item) => item.id === id);
  modifiedPage.value = targetPage;
};

// ------------------------------
// HANDLE DRAG & DROP COMPONENTS
// ------------------------------
const draggedComponent = ref(null);

const isDragging = ref(false);

const onDragStart = (item, e) => {
  // SAFE CLONE (no DataCloneError)
  draggedComponent.value = JSON.parse(JSON.stringify(item));
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
  // console.log(targetComponent)
  // console.log(data.content)
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
  padding: 20px;

  .pages {
    @include displayFlex($justify: start, $gap: 10px);
    margin-bottom: 25px;

    .page_item {
      background: #e4e4e450;
      color: $mainColor;
      padding: 5px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 5px;
      border-radius: 8px;
      transition: 0.3s;
      cursor: pointer;
      text-transform: capitalize;
      width: 120px;
      span {
        max-width: 70px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
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
  button.savePageButton {
    margin-top: auto;
  }
}
</style>
