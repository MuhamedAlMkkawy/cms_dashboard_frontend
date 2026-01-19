<template>
  <div class="project_page page" :style="pages.length === 0 ? 'margin: 0' : ''">
    <div class="side_bar" v-if="pages.length">
      <div class="header_image">
        <button class="back_btn" @click="$router.back()">
          <i
            :class="
              globalStore.lang === 'ar'
                ? 'pi pi-angle-right'
                : 'pi pi-angle-left'
            "
          ></i>
        </button>
        <div class="image">
          <img
            src="@/assets/images/logo.png"
            :alt="t('projectEditor.alts.logo')"
            loading="lazy"
          />
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
          <img :src="currentPage?.logo" alt="logo_image" loading="lazy" />
        </div>
      </div>
    </div>
    <div class="project_content">
      <!-- <div class="pages">
        <button
          class="add_page gradient_background"
          @click="showControlPagePopup = true"
          :title="t('projectEditor.addPage')"
        >
          <i class="pi pi-plus"></i>
          {{ t("projectEditor.addNewPage") }}
        </button>
        <button class="logout_btn main-btn danger" @click="handleLogout">
          <i class="pi pi-sign-out"></i>
        </button>
        <LanguageSwitch />
      </div> -->
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
          class="add_page gradient_background"
          @click="showControlPagePopup = true"
          :title="t('projectEditor.addPage')"
        >
          <i class="pi pi-plus"></i>
          {{ t("projectEditor.addNewPage") }}
        </button>
        <!-- <button class="logout_btn main-btn danger" @click="handleLogout">
          <i class="pi pi-sign-out"></i>
        </button> -->
        <LanguageSwitch />
      </div>
    </div>
    <hr />
    <div :class="['project_sections ', { 'justify-center': !pages.length }]">
      <div
        v-for="section in currentPage?.sections"
        :key="section.id"
        :class="['section ', { hidden_element: !section.visible }]"
      >
        <div class="section_header">
          <h3>{{ section.name }}</h3>
          <div class="buttons">
            <!-- v-if="section.visible" -->
            <button
              @click="handleEditSection(section)"
              class="section_control pi pi-pen-to-square"
            ></button>
            <button
              @click="
                currentPage.sections.splice(
                  currentPage.sections.indexOf(section),
                  1
                )
              "
              class="section_control pi pi-trash"
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

        <div
          class="section_content flex flex-row w-full"
          @dragover.prevent
          @drop="onDropComponent(section, $event)"
        >
          <div
            v-for="(component, index) in section.components"
            :key="component.id"
            class="section_component flex-shrink-0 relative"
            :class="component?.content?.customClasses"
            :style="{
              width:
                component?.content?.customClasses.match(/w-\[(.*?)\]/)?.[1],
            }"
            draggable="true"
            @dragstart="onDragStartComponent(section, component, index, $event)"
            @dragover.prevent
            @drop="onDropComponent(section, $event)"
          >
            <!-- Component content -->
            <div class="component_block">
              <!-- <i :class="'pi ' + component.icon"></i> -->
              <span>{{ component.type }}</span>
            </div>

            <!-- Control buttons -->
            <div class="component_buttons">
              <small>{{ component?.content?.customClasses }}</small>
              <!-- Edit -->
              <button
                class="edit_component"
                :title="t('projectEditor.buttons.editComponent')"
                @click="
                  handleSectionContent(
                    section.id,
                    component.type,
                    component.content
                  )
                "
              >
                <i class="pi pi-pen-to-square"></i>
              </button>

              <button
                class="remove_component"
                :title="t('projectEditor.buttons.removeComponent')"
                @click="removeComponent(section, index)"
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
          >
            {{ t("projectEditor.placeholders.dropHere") }}
          </div>
        </div>
      </div>
      <div
        class="section add_section"
        :title="t('projectEditor.addSection')"
        @click="showControlSectionPopup = true"
        v-if="pages.length"
      >
        <i class="pi pi-plus"></i>
        <span>{{ t("projectEditor.addSection") }}</span>
      </div>

      <Empty v-else />
    </div>

    <button
      class="main-btn"
      :disabled="!isPageChanged"
      @click="handleSavePageContent"
    >
      {{ t("projectEditor.save") }}
    </button>

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
import { useI18n } from "vue-i18n";

const { t } = useI18n();
// -----------------------------
// DEFINE GLOBAL STORE
// -----------------------------
const globalStore = useGlobalStore();

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
      label: page.visible
        ? t("projectEditor.menu.hide")
        : t("projectEditor.menu.show"),
      icon: page.visible ? "pi pi-eye-slash" : "pi pi-eye",
      command: () => handleHidePage(pageId),
    },
    {
      label: t("projectEditor.menu.edit"),
      icon: "pi pi-pencil",
      command: () => handleEditPage(pageId),
    },
  ];
};

// ----------------------------
// HANDLE PAGES CONTENT
// ----------------------------
const pages = ref([]);

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
      _id: (pages.value.length + 1).toString(),
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
    const fromComponents = fromSection.components;
    const toComponents = targetSection.components;

    // Find source index
    const fromIndex = fromComponents.findIndex((c) => c._id === component._id);
    if (fromIndex === -1) return;

    // Remove FIRST (IMPORTANT)
    const [movedComponent] = fromComponents.splice(fromIndex, 1);

    // Fix index when moving inside same section
    let finalIndex = dropIndex;
    if (fromSection.id === targetSection.id && dropIndex > fromIndex) {
      finalIndex -= 1;
    }

    // Insert without replacement
    toComponents.splice(finalIndex, 0, movedComponent);
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
  if (!componentEl) return;

  const containerEl = componentEl.parentElement;
  if (!containerEl) return;

  startWidth = componentEl.offsetWidth;
  containerWidth = containerEl.offsetWidth;

  window.addEventListener("mousemove", resizeMove);
  window.addEventListener("mouseup", stopResize);

  e.preventDefault(); // prevent text selection while resizing
};

const resizeMove = (e) => {
  if (!resizing) return;

  const deltaX = e.clientX - startX;
  let newWidth = ((startWidth + deltaX) / containerWidth) * 100;

  // Clamp width between 5% and 100%
  newWidth = Math.max(5, Math.min(100, newWidth));

  // Ensure content and customClasses exist
  if (!resizing.content) resizing.content = {};
  let classes = resizing.content.customClasses || "";

  // Remove old width class
  classes = classes.replace(/w-\[\d+%?\]/g, "").trim();

  // Add new width class
  resizing.content.customClasses = `${classes} w-[${Math.floor(
    newWidth
  )}%]`.trim();
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
  const targetedSection = currentPage?.value.sections.find(
    (item) => item.id == data.sectionID
  );
  if (!targetedSection)
    return showErrorToast(t("projectEditor.errors.sectionNotFound"));

  const targetComponent = targetedSection.components.find(
    (comp) => comp.type === data.type
  );
  if (!targetComponent)
    return showErrorToast(t("projectEditor.errors.componentNotFound"));

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

  return JSON.stringify(currentPage.value) != JSON.stringify(original);
});

// ----------------------------
// HANDLE SAVE PAGE CONTENT
// ----------------------------
const handleSavePageContent = () => {
  if (!currentPage?.value?.sections?.length) {
    showErrorToast(t("projectEditor.errors.pageContentRequired"));
    return;
  }

  const pageId = getResult?.value ? currentPage.value?._id : "";

  const url = pageId
    ? `/projects/${route.params.id}/pages/${pageId}`
    : `/projects/${route.params.id}/pages`;

  const method = getResult?.value && pageId ? "PATCH" : "POST";

  submitMethod(url, false, currentPage?.value, method, "");

  originalPage.value = JSON.parse(JSON.stringify(currentPage.value));
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
  getMethod(`/projects/${route.params.id}`, null, true, false);
});
</script>

<style lang="scss" scoped>
.project_page {
  margin-inline-start: 250px;
  padding: 20px;
  button.logout_btn {
    width: unset;
    height: 45px;
    padding: 0px 15px;
    margin: 0 !important;
  }
  .pages {
    @include displayFlex($justify: start, $gap: 10px);
    margin-bottom: 15px;

    .page_item {
      background: #e4e4e450;
      color: $mainColor;
      padding: 0px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 5px;
      border-radius: 8px;
      transition: 0.3s;
      cursor: pointer;
      text-transform: capitalize;
      width: 120px;
      min-height: 42px;
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
        width: fit-content;
        // transform: rotate(180deg);
      }

      &.hidden_element {
        background: grey !important;
        border-color: grey !important;
        cursor: default;
      }
      &:not(.active):hover {
        background: #e4e4e4;
      }
      &.active {
        background: rgb(240 93 42 / 15%);
        border: 1px solid rgb(240 93 42);
        color: rgb(240 93 42);
      }
    }
    .add_page {
      margin-inline-start: auto;
      // @include circle(40px);
      border: 1px solid $mainColor;
      display: flex;
      // align-items: center;
      justify-content: center;
      gap: 8px;
      color: #fff;
      transition: 0.6s;
      padding: 4px 8px;
      border-radius: 4px;
      // background: $mainColor;
      min-height: 42px;
      animation: pulse-m infinite 1s linear;
      i.pi {
        font-size: 15px;
        font-weight: 600;
        color: inherit;
      }
      &:hover {
        background: #fff;
        color: $mainColor;
      }
    }
    + hr {
      background: #333;
      height: 3px;
    }
  }
}
</style>
