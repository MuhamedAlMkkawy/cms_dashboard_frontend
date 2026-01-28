<template>
  <div class="nav_menu_fields">
    <h4 class="centered">{{ $t("navMenu.title") }}</h4>

    <div class="menu_group" v-for="(item, index) in body.items" :key="index">
      <!-- Parent -->
      <div :class="['menu_item ', { has_childs: item?.hasChilds }]">
        <div class="input icon_input">
          <label>{{ $t("navMenu.icon") }}</label>
          <button class="icon_select_btn" @click="emit('openIconPicker', item)">
            <i :class="item.icon || 'pi pi-stop'"></i>
          </button>
        </div>

        <div class="input">
          <label>{{ $t("navMenu.titleLabel") }}</label>
          <input
            type="text"
            v-model="item.title"
            :placeholder="$t('navMenu.titlePlaceholder')"
          />
        </div>

        <div class="input" v-if="!item?.hasChilds">
          <label>{{ $t("navMenu.linkLabel") }}</label>
          <input
            type="text"
            v-model="item.link"
            :placeholder="$t('navMenu.linkPlaceholder')"
          />
        </div>

        <div class="input" v-if="!item.hasChilds">
          <label>{{ $t("navMenu.targetLabel") }}</label>
          <select v-model="item.target">
            <option value="_self">{{ $t("navMenu.sameTab") }}</option>
            <option value="_blank">{{ $t("navMenu.newTab") }}</option>
          </select>
        </div>

        <div class="input toggle_input">
          <ToggleSwitch v-model="item.hasChilds" @change="onToggle(index)" />
          <span>{{ $t("navMenu.hasChilds") }}</span>
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
          <h5>
            {{ $t("navMenu.subMenuFor") }} <span>{{ item.title }}</span>
          </h5>
          <button class="add_sub_menu" @click="addSubMenuItem(index)">
            <i class="pi pi-plus"></i>
          </button>
        </div>

        <div
          class="submenu_item"
          v-for="(subItem, subIndex) in item.children"
          :key="`child-${index}-${subIndex}`"
        >
          <div class="icon_input input">
            <label>{{ $t("navMenu.icon") }}</label>
            <button
              class="icon_select_btn"
              @click="emit('openIconPicker', subItem)"
            >
              <i :class="subItem.icon || 'pi pi-stop'"></i>
            </button>
          </div>

          <div class="input">
            <label>{{ $t("navMenu.subTitleLabel") }}</label>
            <input
              type="text"
              v-model="subItem.title"
              :placeholder="$t('navMenu.subTitlePlaceholder')"
            />
          </div>

          <div class="input">
            <label>{{ $t("navMenu.subLinkLabel") }}</label>
            <input
              type="text"
              v-model="subItem.link"
              :placeholder="$t('navMenu.subLinkPlaceholder')"
            />
          </div>

          <div class="input" v-if="!subItem.hasChilds">
            <label>{{ $t("navMenu.subTargetLabel") }}</label>
            <select v-model="subItem.target">
              <option value="_self">{{ $t("navMenu.sameTab") }}</option>
              <option value="_blank">{{ $t("navMenu.newTab") }}</option>
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
      <button class="main-btn reversed" @click="addMenuItem">
        {{ $t("navMenu.addMenuItem") }}
      </button>
      <button class="main-btn" @click="handleSubmitNavMenu">
        {{ $t("navMenu.submit") }}
      </button>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();
const { showErrorToast } = useToastMsg();

const emit = defineEmits([
  "handleSubmitFields",
  "handleCloseComponentPopup",
  "openIconPicker",
]);

const body = reactive({
  items: [
    {
      icon: "",
      title: "",
      link: "",
      target: "_self",
      hasChilds: false,
      children: [{ icon: "", title: "", link: "", target: "_self" }],
    },
  ],
});

const props = defineProps({ values: Object });

watch(
  () => props.values,
  (values) => {
    if (!values) return;
    body.items = values.items.map((item) => ({
      icon: item.icon ?? "",
      title: item.title ?? "",
      link: item.link ?? "",
      target: item.target ?? "_self",
      hasChilds: item.hasChilds ?? false,
      children: item.hasChilds
        ? (item.children ?? []).map((c) => ({
            icon: c.icon ?? "",
            title: c.title ?? "",
            link: c.link ?? "",
            target: c.target ?? "_self",
          }))
        : [],
    }));
  },
  { immediate: true },
);

const addMenuItem = () => {
  body.items.push({
    icon: "",
    title: "",
    link: "",
    target: "_self",
    hasChilds: false,
    children: [],
  });
};

const removeMenuItem = (index) => {
  if (body.items.length > 1) body.items.splice(index, 1);
  else showErrorToast(t("navMenu.menuMinError"));
};

const onToggle = (index) => {
  const item = body.items[index];
  if (item.hasChilds) {
    if (!item.children) item.children = [];
    item.link = "";
  } else {
    item.children = [{ title: "", link: "", target: "_self" }];
  }
};

const addSubMenuItem = (index) => {
  body.items[index].children.push({ title: "", link: "", target: "_self" });
};

const removeSubMenuItem = (i, subIndex) => {
  body.items[i].children.splice(subIndex, 1);
};

const normalizeMenuItems = (items) => {
  return items.map((item) => {
    const normalized = { title: item.title };
    if (item.icon?.trim()) normalized.icon = item.icon;
    if (item.hasChilds) {
      normalized.hasChilds = item.hasChilds;
      if (item.children?.length)
        normalized.children = normalizeMenuItems(item.children);
    } else if (item.link) {
      normalized.link = item.link;
      if (item.target) normalized.target = item.target;
    }
    return normalized;
  });
};

const handleSubmitNavMenu = () => {
  const invalid = body.items.some((i) => {
    if (!i.title) return true;
    if (!i.hasChilds && !i.link) return true;
    if (i.hasChilds && i.children.some((c) => !c.title || !c.link)) return true;
  });
  if (invalid) {
    showErrorToast(t("navMenu.fillAllError"));
    return;
  }
  emit("handleSubmitFields", normalizeMenuItems(body.items));
  emit("handleCloseComponentPopup");
};
</script>
