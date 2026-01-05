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
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
    </div>

    <!-- -----------------------------
        AUTOPLAY TOGGLE
    ----------------------------- -->
    <div class="input">
      <label for="autoplay">Autoplay</label>
      <ToggleButton v-model="slider.autoplay" class="w-24" onLabel="On" offLabel="Off" />
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
      <div 
        class="item_card" 
        v-for="(item, index) in slider.items" 
        :key="index"
      >
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
            <template v-if="!item.url">
              <i class="pi pi-upload"></i>
              <span>Upload Image</span>
            </template>
            <template v-else>
              <Image :src="item.url" alt="uploaded image" loading="lazy" preview />
            </template>
          </label>
          <button class="pi pi-trash delete_btn" @click="removeItem(index)"></button>
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
// TOAST
// -----------------------------
const { showErrorToast } = useToastMsg()

// -----------------------------
// EMITS
// -----------------------------
const emit = defineEmits(['handleFieldsSubmit', 'handleCloseComponentPopup'])

// -----------------------------
// SLIDER STATE
// -----------------------------
const slider = ref({
  itemsToShow: 1,
  autoplay: false,
  items: [{
    url: null,
    file: null,
    title: '',
    text: '',
    link: ''
  }]
})

// -----------------------------
// ADD NEW CARD
// -----------------------------
const addNewCard = () => {
  slider.value.items.push({
    url: null,
    file: null,
    title: '',
    text: '',
    link: ''
  })
}

// -----------------------------
// HANDLE CARD IMAGE UPLOAD
// -----------------------------
const handleCardImageUpload = (event, index) => {
  const file = event.target.files[0]
  if (!file) return
  slider.value.items[index].url = URL.createObjectURL(file)
  slider.value.items[index].file = file
}

// -----------------------------
// REMOVE CARD ITEM
// -----------------------------
const removeItem = (index) => {
  slider.value.items.splice(index, 1)
}

// -----------------------------
// HANDLE SUBMIT
// -----------------------------
const handleSubmitCardSlider = () => {
  if (!slider.value.items.length) {
    showErrorToast('You should add at least one card.')
    return
  }

  const cardSlider = new FormData()
  cardSlider.append('itemsToShow', slider.value.itemsToShow)
  cardSlider.append('autoplay', slider.value.autoplay)

  slider.value.items.forEach((item, index) => {
    if (!item.file) {
      showErrorToast(`Card ${index + 1} is missing an image.`)
      return
    }
    cardSlider.append(`items[${index}][id]`, index)
    cardSlider.append(`items[${index}][file]`, item.file)
    cardSlider.append(`items[${index}][title]`, item.title)
    cardSlider.append(`items[${index}][text]`, item.text)
    cardSlider.append(`items[${index}][link]`, item.link)
  })

  emit('handleFieldsSubmit', cardSlider)
  emit('handleCloseComponentPopup')
}
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
          object-fit: cover;
        }

        .delete_btn {
          position: absolute;
          top: 2px;
          right: 2px;
          background: $dangerColor;
          color: white;
          border: 1px solid $dangerColor;
          border-radius: 3px;
          font-size: 12px;
          padding: 5px;
          cursor: pointer;
          &:hover {
            background: #fff;
            color: $dangerColor;
          }
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
