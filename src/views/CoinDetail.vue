<template>
  <div class="flex-col">
    <div class="flex justify-center">
      <bounce-loader
        :loading="isLoading"
        :color="'#68d391'"
        :size="100"
      ></bounce-loader>
    </div>
    <div class="flex flex-col sm:flex-row justify-around items-center">
      <div class="flex flex-col items-center">
        <img
          :src="`https://static.coincap.io/assets/icons/${asset?.symbol.toLowerCase()}@2x.png`"
          :alt="asset.name"
          class="w-20 h-20 mr-5"
        />
        <h1 class="text-5xl">
          {{ asset.name }}
          <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
        </h1>
      </div>
      <div class="my-10 flex flex-col">
        <ul>
          <li class="flex justify-between">
            <b class="text-gray-600 mr-10 uppercase">Ranking</b>
            <span>#{{ asset.rank }}</span>
          </li>
          <li class="flex justify-between">
            <b class="text-gray-600 mr-10 uppercase">Precio Actual</b>
            <span>{{ dollarFilter(asset.priceUsd) }}</span>
          </li>
          <li class="flex justify-between">
            <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
            <span>{{ dollarFilter(min) }}</span>
          </li>
          <li class="flex justify-between">
            <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
            <span>{{ dollarFilter(max) }}</span>
          </li>
          <li class="flex justify-between">
            <b class="text-gray-600 mr-10 uppercase">Precio promedio</b>
            <span>{{ dollarFilter(avg) }}</span>
          </li>
          <li class="flex justify-between">
            <b class="text-gray-600 mr-10 uppercase">Varación 24hs</b>
            <span>{{ percentFilter(asset.changePercent24Hr) }}</span>
          </li>
        </ul>
      </div>
      <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
        <button
          @click="toggleConverted"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD` }}
        </button>
        <div class="flex flex-row my-5">
          <label class="w-full" for="convertValue">
            <input
              v-model="convertValue"
              id="convertValue"
              type="number"
              class="text-center bg-whitw focus:outline-none focus:shadow-outline border border-gary-300 rounded-lg py-2 px-4 block w-full appearce-none leading-normal"
              :placeholder="`Valor en ${fromUsd ? 'USD' : asset.symbol}`"
            />
          </label>
        </div>
        <span class="text-cl">
          {{ convertResult }} {{ fromUsd ? asset.symbol : "USD" }}
        </span>
      </div>
    </div>
    <line-chart
      class="my-10"
      :colors="['orange']"
      :min="min"
      :max="max"
      :data="history.map((h) => [h.date, parseFloat(h.priceUsd).toFixed(2)])"
    ></line-chart>
    <div class="w-full">
      <h3 class="text-xl my-10">Mejores Ofertas de Cambio</h3>
      <table class="w-full">
        <tr
          v-for="m in markets"
          :key="`${m.exchangeId}-${m.priceUsd}`"
          class="border-b"
        >
          <td>
            <b>{{ m.exchangeId }}</b>
          </td>
          <td>{{ dollarFilter(m.priceUsd) }}</td>
          <td>{{ m.baseSymbol }} / {{ m.quoteSymbol }}</td>
          <td>
            <px-button v-if="!m.url" @click="getWebsite(m)">
              <slot>Obtener Link</slot>
            </px-button>
            <a v-else class="hover:underline text-green-600" target="_blanck">
              {{ m.url }}
            </a>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { getAsset, getAssetHistory, getMarkets, getExchanges } from "@/api";
import { dollarFilter, percentFilter } from "@/filters";
import BounceLoader from "vue-spinner/src/BounceLoader.vue";
import PxButton from "@/components/PxButton.vue";

export default {
  name: "CoinDetail",
  components: { BounceLoader, PxButton },

  data() {
    return {
      asset: {},
      history: [],
      markets: [],
      isLoading: false,
      fromUsd: true,
      convertValue: null,
    };
  },
  setup() {
    return {
      dollarFilter,
      percentFilter,
    };
  },

  computed: {
    convertResult() {
      if (!this.convertValue) {
        return 0;
      }
      const result = this.fromUsd
        ? this.convertValue / this.asset.priceUsd
        : this.convertValue * this.asset.priceUsd;
      return result.toFixed(4);
    },

    min() {
      return Math.min(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },
    max() {
      return Math.max(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },
    avg() {
      return (
        this.history.reduce((a, b) => a + parseFloat(b.priceUsd), 0) /
        this.history.length
      );
    },
  },
  watch: {
    $route() {
      this.getCoin();
    },
  },

  created() {
    this.isLoading = true;
    this.getCoin();
  },

  methods: {
    toggleConverted() {
      this.fromUsd = !this.fromUsd;
    },

    getWebsite(exchange) {
      return getExchanges(exchange.exchangeId).then((res) => {
        exchange.url= res.exchangeUrl;
      });
    },

    getCoin() {
      const id = this.$route.params.id;
      Promise.all([getAsset(id),getAssetHistory(id),getMarkets(id)])
      .then(([asset,history,market]) => {
        this.asset= asset
        this.history=history
        this.markets=market
      }).finally( () => ( this.isLoading = false))
    },
  },
};
</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>
