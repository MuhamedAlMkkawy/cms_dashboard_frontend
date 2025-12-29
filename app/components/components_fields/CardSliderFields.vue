<template>
  <div class="card_fields">
    <h4 class="centered">Card Slider</h4>

    <!-- items to show -->
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

    <!-- autoplay -->
    <div class="input">
      <label for="autoplay">Autoplay</label>
      <ToggleButton v-model="slider.autoplay" class="w-24" onLabel="On" offLabel="Off" />
    </div>

    <!-- upload -->
    <div class="input upload_images">
      <input 
        type="file" 
        name="card_images" 
        id="card_images" 
        hidden 
        accept="image/*"
        multiple
        @change="handleImagesUpload"
      />
      <label for="card_images" class="upload_card_images">
        <i class="pi pi-upload"></i>
        <span>Upload Images</span>
      </label>
    </div>

    <!-- preview images -->
    <div class="images">
      <div 
        class="image_item" 
        v-for="(img, i) in slider.images" 
        :key="i"
      >
        <Image :src="img" alt="uploaded image" loading="lazy" preview />
        <button class="pi pi-trash delete_btn" @click="removeImage(i)"></button>
      </div>
    </div>

    <button class="main-btn" @click="$emit('handleSubmitFields' , slider)">
      Submit
    </button>
  </div>
</template>

<script setup>
  const slider = ref({
    itemsToShow : 1,
    autoplay: false,
    images : []
  })

  //----------------------
  // HANDLE IMAGES UPLOAD
  //----------------------
  const handleImagesUpload = (event) => {
    const files = event.target.files
    if (!files || !files.length) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        slider.value.images.push(e.target.result) 
      }
      reader.readAsDataURL(file)
    })
  }

  // -----------------
  // REMOVE AN IMAGE
  // -----------------
  const removeImage = (index) => {
    slider.value.images.splice(index, 1)
  }
</script>

<style lang="scss" scoped>
  .card_fields {
    .input {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: none;

      select {
        border: 1px solid #e4e4e4;
        width: 80px;
        cursor: pointer;
      }
    }

    label.upload_card_images {
      @include circle(50px , 4px);
      border: 1px dashed #e4e4e4;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: 0.3s;
      width: 100%;
      span{
        font-size: 14px;
        margin-inline-start: 8px;
      }
      &:hover {
        // background: $mainColor;
        color: $mainColor;
        border-color: $mainColor;
      }
    }

    .images {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .image_item {
        position: relative;
        @include circle(100px , 8px);
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
          &:hover{
            background: #fff;
            color: $dangerColor;
          }
        }
      }
    }
  }
</style>