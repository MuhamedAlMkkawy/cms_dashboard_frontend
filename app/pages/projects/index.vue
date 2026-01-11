<template>
  <div class="page projects_page gradient_background">
    <div class="container">
      <div class="image mazaya_logo">
        <img src="@/assets/images/logo.png" alt="logo image" loading="lazy" />
      </div>
      <div class="content_items items_4">
        <NuxtLink
          v-for="(project, index) in getResult?.data"
          :key="project._id"
          :to="`/projects/${project._id}`"
          :class="['content_item', { drafted_item: !project.visible }]"
        >
          <div class="image">
            <img :src="project.logo" :alt="project?.name" loading="lazy" />
          </div>
          <div class="item_control">
            <!-- <button class="edit_btn pi pi-pencil" title="edit project"></button> -->
            <button
              :class="['draft_btn pi', project.visible ? 'pi-eye-slash' : 'pi-eye']"
              :title="project.visible ? 'draft project' : 'undraft project'"
              @click.stop.prevent="handleDraftProject(project._id, project.visible)"
            ></button>
          </div>
        </NuxtLink>
        <NuxtLink
          to="/modify_project"
          class="content_item add_project"
          title="add project"
        >
          <i class="pi pi-plus"></i>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
  const { getMethod , submitMethod , getResult } = useApiMethods();

  definePageMeta({
    layout: "none",
  });

  //  HANDLE DRAFT THE PROJECT 
  const handleDraftProject = (projectID , projectVisible) => {
    submitMethod(`projects/${projectID}` , false , {
      visible : !projectVisible
    }, 'PATCH' , '' , 'projects')
  }


  onMounted(() => {
    getMethod("projects", null, false, false);
  });
</script>

<style lang="scss" scoped>
.projects_page {
  padding-block: 0px;
  .container {
    @include displayFlex($direction: column, $gap: 50px);
    // min-height: 100vh;
    // background: $textColor;
    max-width: unset;
    .mazaya_logo {
      max-width: 400px;
    }
    .content_items {
      // @include displayFlex($wrap : wrap , $align : stretch , $gap : 20px);
      // width: 100%;
      .content_item {
        border: 1px solid #fff;
        padding: clamp(20px, 2.5vw, 50px);
        border-radius: 4px;
        transition: 0.6s;
        position: relative;
        width: 100%;
        .image {
          max-width: 180px;
          margin: 0 auto;
          filter: brightness(0) invert(1);
          transition: 1s;
        }
        .item_control {
          @include displayFlex($gap: 5px);
          position: absolute;
          top: 10px;
          inset-inline-end: 15px;
          z-index: 9;
          opacity: 0;
          button {
            border: 1px solid;
            padding: 8px;
            font-size: 15px;
            border-radius: 4px;
            &.edit_btn {
              color: $mainColor;
              &:hover {
                background: $mainColor;
                color: #fff;
              }
            }
            &.draft_btn {
              color: $dangerColor;
              border-color: $dangerColor;
              &:hover {
                background: $dangerColor;
                color: #fff;
              }
            }
          }
        }
        &:hover {
          background: #fff;
          .image {
            filter: unset;
          }
          .item_control {
            opacity: 1;
          }
        }
      }
    }
  }
  .add_project {
    border-style: dashed !important;
    @include displayFlex();
    cursor: pointer;
    i {
      font-size: 30px;
    }
    &:hover {
      color: $mainColor;
    }
  }
}
</style>
