<template>
  <div id="map" class="h-screen w-full"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import equipmentData from "@/data/equipment.json";
import positionHistory from "@/data/equipmentPositionHistory.json";
import stateHistory from "@/data/equipmentStateHistory.json";
import {
  Equipment,
  EquipmentPositionHistory,
  EquipmentStateHistory,
} from "@/types/equipment";

export default defineComponent({
  emits: ["equipment-selected"],
  setup(props, { emit }) {
    onMounted(() => {
      const defaultIcon = L.icon({
        iconUrl: require("@/assets/marker-icon.png"),
        shadowUrl: require("@/assets/marker-shadow.png"),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const map = L.map("map").setView([-19.126536, -45.947756], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const markers: L.Marker[] = [];

      (equipmentData as Equipment[]).forEach((eq: Equipment) => {
        const pos = (positionHistory as EquipmentPositionHistory[])
          .find((p: EquipmentPositionHistory) => p.equipmentId === eq.id)
          ?.positions.slice(-1)[0];
        if (pos) {
          const states =
            (stateHistory as EquipmentStateHistory[]).find(
              (s) => s.equipmentId === eq.id
            )?.states || [];
          const popupContent = `
            <div style="width: 250px; padding: 10px;">
              <b>${eq.name}</b><br>
              Última Posição: ${pos.lat}, ${pos.lon}<br>
              <b>Histórico de Estados:</b><br>
              <div style="max-height: 150px; overflow-y: auto; overflow-x: hidden; word-wrap: break-word;">
                ${states
                  .map(
                    (state: { date: string; equipmentStateId: string }) =>
                      `${state.date}: ${state.equipmentStateId}`
                  )
                  .join("<br>")}
              </div>
            </div>
          `;
          const marker = L.marker([pos.lat, pos.lon], { icon: defaultIcon })
            .addTo(map)
            .bindPopup(popupContent, {
              maxWidth: 250,
              minWidth: 250,
              maxHeight: 200,
            })
            .on("click", () => {
              console.log("Emitindo equipmentId:", eq.id);
              emit("equipment-selected", eq.id);
            });
          markers.push(marker);
        }
      });

      map.on("popupclose", () => {
        map.invalidateSize();
        markers.forEach((marker) => marker.addTo(map));
      });
    });
  },
});
</script>
