<template>
  <div class="flex justify-center">
    <bounce-loader
      :loading="isLoading"
      :color="'#68d391'"
      :size="'100px'"
    ></bounce-loader>
    <px-assets-table v-if="!isLoading" v-bind:assets="assets" />
  </div>
</template>

<script>
import PxAssetsTable from "@/components/PxAssetsTable.vue";
import getAssets from "@/api";
import BounceLoader from "vue-spinner/src/BounceLoader.vue";

export default {
  components: { PxAssetsTable, BounceLoader },
  name: "Home",

  data() {
    return {
      isLoading: false,
      assets: [],
    };
  },

  created() {
    this.isLoading = true;
    this.getData();
  },
  methods: {
    async getData() {
      this.assets = await getAssets();
      this.isLoading = false;
    },
  },
};
</script>
