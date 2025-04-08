<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import Chart from "chart.js/auto";
import stateHistory from "@/data/equipmentStateHistory.json";
import { EquipmentStateHistory } from "@/types/equipment";

export default defineComponent({
  name: "ProductivityChart",
  props: {
    equipmentId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const chartCanvas = ref<HTMLCanvasElement | null>(null);
    let chartInstance: Chart | null = null;

    const updateChart = () => {
      console.log("Atualizando gráfico com equipmentId:", props.equipmentId);
      const ctx = chartCanvas.value?.getContext("2d");
      if (!ctx) {
        console.error("Contexto do canvas não encontrado");
        return;
      }

      const equipmentStates =
        (stateHistory as EquipmentStateHistory[]).find(
          (sh) => sh.equipmentId === props.equipmentId
        )?.states || [];

      if (equipmentStates.length === 0) {
        console.warn(
          "Nenhum estado encontrado para equipmentId:",
          props.equipmentId
        );
        return;
      }

      const dates = equipmentStates.map((state) =>
        new Date(state.date).toLocaleString()
      );
      const productivityData = equipmentStates.map((state) => {
        switch (state.equipmentStateId) {
          case "03b2d446-e3ba-4c82-8dc2-a5611fea6e1f":
            return 1; // Ex.: OPERATING
          case "baff9783-84e8-4e01-874b-6fd743b875ad":
            return 0; // Ex.: STOPPED
          case "0808344c-454b-4c36-89e8-d7687e692d57":
            return 2; // Ex.: MAINTENANCE
          default:
            return -1; // Desconhecido
        }
      });

      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: dates,
          datasets: [
            {
              label: "Produtividade do Equipamento",
              data: productivityData,
              borderColor: "rgba(75, 192, 192, 1)",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: { title: { display: true, text: "Data/Hora" } },
            y: {
              title: { display: true, text: "Estado" },
              beginAtZero: true,
              ticks: {
                callback: (value) => {
                  switch (value) {
                    case 1:
                      return "OPERATING";
                    case 0:
                      return "STOPPED";
                    case 2:
                      return "MAINTENANCE";
                    default:
                      return "UNKNOWN";
                  }
                },
              },
            },
          },
        },
      });
    };

    onMounted(() => {
      console.log(
        "ProductivityChart montado, equipmentId inicial:",
        props.equipmentId
      );
      if (props.equipmentId) updateChart();
    });

    watch(
      () => props.equipmentId,
      (newId, oldId) => {
        console.log("equipmentId mudou de", oldId, "para", newId);
        if (newId) updateChart();
      }
    );

    return { chartCanvas };
  },
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
}
</style>
