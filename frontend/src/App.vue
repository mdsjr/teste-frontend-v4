<template>
  <div class="flex flex-col md:flex-row">
    <div class="w-full md:w-2/3">
      <MapComponent @equipment-selected="updateEquipmentId" />
    </div>
    <div class="w-full md:w-1/3 p-4">
      <ProductivityChart :equipment-id="selectedEquipmentId" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import MapComponent from "./components/MapComponent.vue";
import ProductivityChart from "./components/ProductivityChart.vue";

export default defineComponent({
  components: {
    MapComponent,
    ProductivityChart,
  },
  setup() {
    const selectedEquipmentId = ref("");

    const updateEquipmentId = (equipmentId: string) => {
      console.log("Recebido equipmentId no App.vue:", equipmentId);
      selectedEquipmentId.value = equipmentId;
    };

    return { selectedEquipmentId, updateEquipmentId };
  },
});
</script>
