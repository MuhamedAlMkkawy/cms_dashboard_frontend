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
        @dragStart="onDragStartComponentFromSidebar"
        @dragEnd="onDragEndComponentFromSidebar"
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
            { active: activePage === page?._id, hidden_element: !page.visible },
          ]"
          @click="activePage = page?._id"
        >
          <span>{{ page?.name }}</span>

          <Button
            type="button"
            icon="pi pi-ellipsis-v"
            @click.stop="openMenu(page._id, $event)"
            aria-haspopup="true"
            :aria-controls="`menu_${page._id}`"
            v-if="page == currentPage"
          />

          <Menu
            :ref="(el) => (menuRefs[page._id] = el)"
            :id="`menu_${page._id}`"
            :model="getPageMenuItems(page._id)"
            :popup="true"
          />
        </div>
        <button
          class="add_page"
          @click="showControlPagePopup = true"
          title="Add Page"
        >
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
          <h3>{{ section.name }}</h3>
        </div>

        <div
          class="section_content flex flex-row w-full gap-3"
          @dragover.prevent
        >
          <div
            v-for="(component, index) in section.components"
            :key="component.id"
            class="section_component flex-shrink-0 relative"
            :style="{ width: component.width + '%' }"
            draggable="true"
            @dragstart="onDragStartComponent(section, component, index, $event)"
            @dragover.prevent
            @drop="onDropComponent(section, $event)"
          >
            <!-- Component content -->
            <div class="component_block">
              <i :class="'pi ' + component.icon"></i>
              <span>{{ component.label }}</span>
            </div>

            <!-- Control buttons -->
            <div class="component_buttons">
              <!-- Edit -->
              <button
                class="edit_component"
                @click="
                  handleSectionContent(
                    section.id,
                    component.type,
                    component.content
                  )
                "
                title="Edit Component"
              >
                <i class="pi pi-pen-to-square"></i>
              </button>

              <!-- Remove -->
              <button
                class="remove_component"
                @click="removeComponent(section, index)"
                title="Remove Component"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>

            <!-- Resize handle -->
            <div
              class="resize_handle"
              @mousedown.prevent="startResize(section, component, $event)"
            ></div>
          </div>

          <!-- Empty placeholder for new components -->
          <div
            v-if="draggedComponent && draggedComponent.fromSection !== section"
            class="section_component empty_placeholder"
            @dragover.prevent
            @drop="onDropComponent(section, $event)"
          >
            Drop here
          </div>
        </div>
      </div>
      <div
        class="section add_section"
        title="Add Section"
        @click="showControlSectionPopup = true"
      >
        <i class="pi pi-plus"></i>
        <span>Add Section</span>
      </div>
    </div>

    <!-- #################### Control Section Popup ###################-->
    <ControlSectionPopup
      v-if="showControlSectionPopup"
      :modifiedSection="modifiedSection"
      @handleShowControlSectionPopup="showControlSectionPopup = false"
      @handleSectionPopup="handleSectionPopup"
    />
    <!-- ################# Control Section  Popup #####################-->
    <!-- ##################### Control Page Popup #####################-->
    <ControlPagePopup
      v-if="showControlPagePopup"
      :modifiedPage="modifiedPage"
      @handleShowControlPagePopup="showControlPagePopup = false"
      @handleControlPage="handleControlPage"
    />
    <!-- ################### Control Page  Popup ######################-->
    <!-- ############## Control Component Content  Popup ##############-->
    <ComponentPopup
      v-if="componentData.type"
      :componentData="componentData"
      @handleCloseComponentPopup="componentData = {}"
      @handleAddComponentContent="handleAddComponentContent"
    />
    <!-- ############## Control Component Content  Popup ##############-->
  </div>
</template>

<script setup>
// -----------------------------
// DEFINE ROUTE
// -----------------------------
const route = useRoute();

// -----------------------------
// HANDLE API Methods
// -----------------------------
const { getMethod, getResult, submitMethod, showErrorToast } = useApiMethods();

// ----------------------------
// HANDLE PAGE ITEM 'S MENU
// ----------------------------
const menuRefs = reactive({}); // كل Menu لكل صفحة

const openMenu = (pageId, event) => {
  const menu = menuRefs[pageId];
  if (menu) menu.toggle(event); // هذا يفتح popup
};

const getPageMenuItems = (pageId) => {
  const page = pages.value.find((p) => p._id === pageId);
  if (!page) return [];

  return [
    {
      label: page.visible ? "Hide" : "Show",
      icon: page.visible ? "pi pi-eye-slash" : "pi pi-eye",
      command: () => handleHidePage(pageId),
    },
    {
      label: "Edit",
      icon: "pi pi-pencil",
      command: () => handleEditPage(pageId),
    },
    // {
    //   label: "Delete",
    //   icon: "pi pi-trash",
    //   command: () => handleDeletePage(pageId),
    // }
  ];
};

// ----------------------------
// HANDLE PAGES CONTENT
// ----------------------------
const pages = ref([]);
// {
//   id: 1,
//   name: "home",
//   visible: true,
//   sections: [],
// },

// ----------------------------
// HANDLE ACTIVE PAGE
// ----------------------------
const activePage = ref();
const currentPage = computed(() =>
  pages.value.find((p) => p._id === activePage.value)
);

// ----------------------------
// HANDLE CONTROL SECTION POPUP
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
// HANDLE CONTROL PAGE POPUP
// ----------------------------
const modifiedPage = ref();
const showControlPagePopup = ref(false);

const handleControlPage = (page) => {
  if (modifiedPage.value) {
    const targetPage = pages.value.find(
      (item) => item._id === modifiedPage.value._id
    );
    if (targetPage) targetPage.name = page.name;
  } else {
    const newPage = {
      // _id: (pages.value.length + 1).toString(),
      name: page.name,
      visible: true,
      sections: [],
    };
    pages.value.push(newPage);
    activePage.value = newPage._id;
  }
  showControlPagePopup.value = false;
  modifiedPage.value = null;
};

const handleHidePage = (id) => {
  const targetPage = pages?.value?.find((item) => item._id === id);
  targetPage.visible = !targetPage.visible;
};

const handleEditPage = (id) => {
  showControlPagePopup.value = true;
  const targetPage = pages?.value?.find((item) => item._id == id);
  modifiedPage.value = targetPage;
};

// ------------------------------
// HANDLE DRAG & DROP COMPONENTS
// ------------------------------
const draggedComponent = ref(null);
// Parent JS
const onDragStartComponentFromSidebar = ({ item, index, event }) => {
  draggedComponent.value = { component: item, fromSidebar: true };
  event.dataTransfer.effectAllowed = "copy"; // Because it's coming from sidebar
  event.dataTransfer.setData("text/plain", "dragging"); // needed for Firefox
};

const onDragEndComponentFromSidebar = (event) => {
  draggedComponent.value = null;
};

// ---------------------
// Drag & Drop
// ---------------------
const onDragStartComponent = (section, component, index, e) => {
  draggedComponent.value = { component, fromSection: section, index };
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", "dragging"); // needed for Firefox
};

const onDropComponent = (targetSection, e) => {
  if (!draggedComponent.value) return;

  const { component, fromSidebar, fromSection } = draggedComponent.value;

  // Determine container and children for drop index
  const container = e.currentTarget.closest(".section_content");
  const children = Array.from(
    container.querySelectorAll(".section_component")
  ).filter((c) => !c.classList.contains("empty_placeholder"));

  let dropIndex = children.length; // default append
  for (let i = 0; i < children.length; i++) {
    const rect = children[i].getBoundingClientRect();
    if (e.clientX < rect.left + rect.width / 2) {
      dropIndex = i;
      break;
    }
  }

  if (fromSidebar) {
    // Add new component
    const newComponent = { ...component, id: Date.now(), width: 30 };
    targetSection.components.splice(dropIndex, 0, newComponent);
  } else {
    // Remove from original section
    const removeIndex = fromSection.components.findIndex(
      (c) => c.id === component.id
    );
    if (removeIndex !== -1) fromSection.components.splice(removeIndex, 1);

    // Insert into target section
    targetSection.components.splice(dropIndex, 0, component);
  }

  draggedComponent.value = null;
};

// ---------------------
// Resize
// ---------------------
let resizing = null;
let startX = 0;
let startWidth = 0;
let containerWidth = 0;

const startResize = (section, component, e) => {
  resizing = component;
  startX = e.clientX;

  const componentEl = e.target.closest(".section_component");
  const containerEl = componentEl.parentElement;

  startWidth = componentEl.offsetWidth;
  containerWidth = containerEl.offsetWidth;

  window.addEventListener("mousemove", resizeMove);
  window.addEventListener("mouseup", stopResize);
};

const resizeMove = (e) => {
  if (!resizing) return;

  const deltaX = e.clientX - startX;
  let newWidth = ((startWidth + deltaX) / containerWidth) * 100;

  // allow full width
  newWidth = Math.max(5, Math.min(100, newWidth));

  resizing.content.customClasses = +newWidth.toFixed(2);
  conosle.log(resizing)
  conosle.log('-------------------')
};

const stopResize = () => {
  resizing = null;
  window.removeEventListener("mousemove", resizeMove);
  window.removeEventListener("mouseup", stopResize);
};

// ----------------------------------
// HANDLE ADD THE COMPONENT POPUP
// ----------------------------------
const componentData = ref({});

const removeComponent = (section, index) => {
  section.components.splice(index, 1);
};

const handleSectionContent = (sectionID, type, values) => {
  componentData.value.sectionID = sectionID;
  componentData.value.type = type;
  componentData.value.values = values;
};

const handleAddComponentContent = (data) => {
  // 1 Find section
  const targetedSection = currentPage?.value.sections.find(
    (item) => item.id == data.sectionID
  );
  if (!targetedSection) return showErrorToast("Section not found");

  // 2 Find component inside section
  const targetComponent = targetedSection.components.find(
    (comp) => comp.type === data.type
  );
  if (!targetComponent) return showErrorToast("Component not found");

  // 3 Add / replace content
  targetComponent.content = data.content;
};

// ----------------------------
// HANDLE CHANGE SECTION LAYOUT
// ----------------------------
const changeLayout = (section) => {
  section.layout_items =
    section.layout_items < 3 ? section.layout_items + 1 : 1;
};

const originalPages = ref({});

watch(
  () => getResult?.value,
  (newValue) => {
    if (!newValue) return;

    pages.value = newValue.data.pages;
    activePage.value = newValue.data.pages[0]?._id;

    // snapshot لكل صفحة بالـ id
    newValue.data.pages.forEach((page) => {
      originalPages.value[page._id] = JSON.parse(JSON.stringify(page));
    });
  },
  { immediate: true }
);

const isPageChanged = computed(() => {
  if (!currentPage.value) return false;

  const pageId = currentPage.value._id;
  const original = originalPages.value[pageId];

  if (!original) return false;

  return JSON.stringify(currentPage.value) !== JSON.stringify(original);
});

// ----------------------------
// HANDLE SAVE PAGE CONTENT
// ----------------------------
const handleSavePageContent = () => {
  if (!currentPage?.value?.sections?.length) {
    showErrorToast("You have to add data for the page to be added...");
  } else {
    // GET THE CURRENT PAGE ID TO EDIT IF HAS THE PROJECT HAS PAGES
    const pageId = getResult?.value ? currentPage.value?._id : "";

    // DETECT THE ENDPOINT BASED ON THE METHOD
    const url = pageId
      ? `/projects/${route.params.id}/pages/${pageId}`
      : `/projects/${route.params.id}/pages`;

    // DETECT WHICH API METHOD DEBEND ON THE PAGE VALUE
    const method = getResult?.value && pageId ? "PATCH" : "POST";

    // SUBMIT THE METHOD
    submitMethod(url, false, currentPage?.value, method, "");

    // AFTER SUBMIT
    originalPage.value = JSON.parse(JSON.stringify(currentPage.value));
  }
};

// CHECK IF THE PROJECT HAS PAGES
watch(
  () => getResult?.value,
  (newValue) => {
    if (newValue) {
      pages.value = newValue?.data?.pages;
      activePage.value = newValue?.data?.pages[0]?._id;
    }
  }
);

onMounted(() => {
  getMethod(`/projects/${route.params.id}`, null, false, false);
});
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
      min-height: 50px;
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
    }
    .add_page {
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
    + hr {
      background: #333;
      height: 3px;
    }
  }
  button.savePageButton {
    margin-top: auto;
    &:disabled {
      opacity: 0.5;
      pointer-events: none;
      user-select: none;
    }
  }
}
</style>
