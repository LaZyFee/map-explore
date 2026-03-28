import { config, Map, MapStyle, Marker, Popup } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { mockData } from "../mockData";

config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY || "YOUR_FREE_KEY_HERE";


export function searchNearby(query = "") {
  const lowerQuery = query.toLowerCase().trim();

  const filteredShops = mockData.shops.filter(
    item => !lowerQuery || item.name.toLowerCase().includes(lowerQuery)
  );
  const filteredRiders = mockData.riders.filter(
    item => !lowerQuery || item.name.toLowerCase().includes(lowerQuery)
  );

  return {
    shops: filteredShops,
    riders: filteredRiders
  };
}

export function addMarkers(map, items, type) {
  if (!map) return [];

  const markers = items.map((item) => {
    let color = "#3388ff"; // default blue
    if (type === "shop") color = "#e74c3c";     // red
    if (type === "rider") color = "#2ecc71";    // green
    if (type === "user") color = "#f1c40f";     // yellow/gold

    const marker = new Marker({
      color,
    })
      .setLngLat([item.lng, item.lat])
      .setPopup(
        new Popup({ offset: 25, closeButton: true, closeOnClick: false })
          .setHTML(`
            <div style="min-width: 140px; font-family: sans-serif;">
              <strong>${item.name || "Unknown"}</strong><br>
              ${type === "rider" ? `Status: ${item.status || "unknown"}<br>` : ""}
              <small>${item.lat.toFixed(4)}, ${item.lng.toFixed(4)}</small>
            </div>
          `)
      )
      .addTo(map);

    return marker;
  });

  return markers;
}

export function initMap(containerId, center, zoom = 14) {
  const map = new Map({
    container: containerId,
    style: MapStyle.STREETS,
    center: [center.lng, center.lat],
    zoom: zoom,
  });

  map.on("load", () => {
    console.log("MapTiler map loaded successfully");

  });

  return map;
}

export function removeMap(map) {
  if (map) map.remove();
}