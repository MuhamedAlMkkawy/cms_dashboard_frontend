<template>
  <div class="card_fields">
    <h4 class="centered">Card Slider</h4>

    <!-- -----------------------------
        ITEMS TO SHOW
    ----------------------------- -->
    <div class="input">
      <label for="cardItems">Items To Show</label>
      <div class="input-wrap">
        <select name="card_items" v-model="slider.itemsToShow" id="card_items">
          <option v-for="i in 5" :key="i" :value="i">{{ i }}</option>
        </select>
      </div>
    </div>

    <!-- -----------------------------
        AUTOPLAY TOGGLE
    ----------------------------- -->
    <div class="input">
      <label for="autoplay">Autoplay</label>
      <ToggleButton
        v-model="slider.autoplay"
        class="w-24"
        onLabel="On"
        offLabel="Off"
      />
    </div>

    <!-- -----------------------------
        ADD NEW CARD
    ----------------------------- -->
    <div class="flex_header">
      <h4>Card Items</h4>
      <button class="main-btn mb-4" @click="addNewCard">
        <i class="pi pi-plus"></i>
      </button>
    </div>

    <!-- -----------------------------
        CARD ITEMS EDITOR
    ----------------------------- -->
    <div class="items_editor">
      <div class="item_card" v-for="(item, index) in slider.items" :key="index">
          <button
            class="pi pi-trash delete_btn"
            v-if="slider.items.length > 1"
            @click="removeItem(index)"
          ></button>
        <!-- IMAGE UPLOAD -->
        <div class="image_wrapper">
          <input
            type="file"
            :id="`card_image_${index}`"
            hidden
            accept="image/*"
            @change="handleCardImageUpload($event, index)"
          />
          <label :for="`card_image_${index}`" class="upload_placeholder">
            <template v-if="!item.file">
              <i class="pi pi-upload"></i>
              <span>Upload Image</span>
            </template>
            <template v-else>
              <img
                :src="item.file"
                alt="uploaded image"
                loading="lazy"
                preview
              />
            </template>
          </label>
        </div>

        <!-- TITLE INPUT -->
        <input
          type="text"
          v-model="item.title"
          placeholder="Card Title"
          class="card_input"
        />

        <!-- TEXT INPUT -->
        <textarea
          v-model="item.text"
          placeholder="Card Text"
          class="card_input"
        ></textarea>

        <!-- LINK INPUT -->
        <input
          type="text"
          v-model="item.link"
          placeholder="Route / Link"
          class="card_input"
        />
      </div>
    </div>

    <slot></slot>

    <!-- -----------------------------
        SUBMIT BUTTON
    ----------------------------- -->
    <button class="main-btn mt-4" @click="handleSubmitCardSlider">
      Submit
    </button>
  </div>
</template>

<script setup>
// -----------------------------
// DEFINE API METHODS
// -----------------------------
const { submitMethod, submitResult, showErrorToast } = useApiMethods();

// -----------------------------
// EMITS
// -----------------------------
const emit = defineEmits(["handleSubmitFields", "handleCloseComponentPopup"]);

// -----------------------------
// SLIDER STATE
// -----------------------------
const slider = ref({
  itemsToShow: 1,
  autoplay: false,
  items: [
    {
      file: null,
      title: "",
      text: "",
      link: "",
    },
  ],
});

// -----------------------------
// ADD NEW CARD
// -----------------------------
const addNewCard = () => {
  slider.value.items.push({
    file: null,
    title: "",
    text: "",
    link: "",
  });
};

// -----------------------------
// DETECT THE INDEX OF THE ITEM TO RETURN THE PATH OF ITS UPLOADED IMAGE
// -----------------------------
const itemIndex = ref()


// -----------------------------
// HANDLE CARD IMAGE UPLOAD
// -----------------------------
const handleCardImageUpload = (event, index) => {
  const file = event.target.files[0];
  if (!file) return showErrorToast('No file found to upload');

  itemIndex.value = slider.value.items[index]


  const formData = new FormData()
  formData.append('file' , file)

  submitMethod('/uploads/single' , false , formData , 'POST' , null)
};

watchEffect(()=>{
  if(submitResult?.value){
    itemIndex.value.file = submitResult?.value?.data?.path;
  }
})


// -----------------------------
// REMOVE CARD ITEM
// -----------------------------
const removeItem = (index) => {
  slider.value.items.splice(index, 1);
};

// ----------------------------
// DEFINE PROPS
// ----------------------------
const props = defineProps({
  values: Object,
});

// -----------------------------
// HADNLE VIEWING THE RENDERED VALUES
// -----------------------------
watch(
  () => props.values,
  (values) => {
    if (!values) return;

    slider.value = {
      itemsToShow: values.itemsToShow ?? 1,
      autoplay: values.autoplay ?? false,
      items:
        values.items?.map((item) => ({
          file: item.file,
          title: item.title ?? "",
          text: item.text ?? "",
          link: item.link ?? "",
        })) || [],
    };
  },
  { immediate: true }
);

// -----------------------------
// HANDLE SUBMIT
// -----------------------------
const handleSubmitCardSlider = () => {
  if (!slider.value.items.length) {
    showErrorToast("You should add at least one card.");
    return;
  }

  // Validate each card
  const invalidIndex = slider.value.items.findIndex((item) => {
    return (
      !item.file || // file missing
      !item.title?.trim() || // title empty
      !item.text?.trim() || // text empty
      !item.link?.trim() // link empty
    );
  });

  if (invalidIndex !== -1) {
    showErrorToast(`Please fill all fields for card #${invalidIndex + 1}`);
    return;
  }

  // All fields have its own values
  const validatedSlider = {
    itemsToShow: slider.value.itemsToShow,
    autoplay: slider.value.autoplay,
    items: slider.value.items.map((item) => ({
      file: item.file,
      title: item.title.trim(),
      text: item.text.trim(),
      link: item.link.trim(),
    })),
  };

  emit("handleSubmitFields", validatedSlider);
  emit("handleCloseComponentPopup");
};
</script>

<style lang="scss" scoped>
.card_fields {
  .input {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    select {
      border: 1px solid #e4e4e4;
      border-radius: 4px;
      width: 95px;
      height: 40px;
      cursor: pointer;
      text-align: center;
      font-size: 16px;
      font-weight: 600;
    }
  }

  .items_editor {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .item_card {
      display: flex;
      flex-direction: column;
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 8px;
      width: 300px;
      flex-grow: 1;
      gap: 8px;
      background: #fff;
      position: relative;

      .delete_btn {
        position: absolute;
        top: 2px;
        right: 2px;
        background: $dangerColor;
        color: white;
        border: 1px solid $dangerColor;
        border-radius: 3px;
        font-size: 12px;
        z-index: 9;
        cursor: pointer;
        &:hover {
          background: #fff;
          color: $dangerColor;
        }
      }


      .image_wrapper {
        position: relative;
        width: 100%;
        height: 100px;
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        label.upload_placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          width: 100%;
          height: 100%;
          background: #f9f9f9;
          border: 1px dashed #ddd;
          span {
            font-size: 12px;
            margin-top: 4px;
          }
          i {
            font-size: 20px;
          }
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .card_input {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 6px;
        font-size: 14px;
        width: 100%;
      }
    }
  }
}
</style>
