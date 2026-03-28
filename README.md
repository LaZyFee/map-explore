# 🗺️ Map Module (Next.js)

A flexible and scalable map system supporting routing, multiple stops, and nearby search features using various map providers.

---

## 🚀 Features

### 📍 Multiple Locations
- Display multiple markers on the map
- Support dynamic location data (user, shops, riders, etc.)

---

### 🧭 From → To Routing
- Draw route between two points (A → C)
- Supports real-time updates on location change

---

### 🛑 Multiple Stopages (Waypoints)
- Handle intermediate stops between routes  
- Example:
  - Route: A → C  
  - Stop: B  
  - Output:
    - A → B  
    - B → C  

---

### 🔍 Search & Nearby Results

#### 🏪 Nearby Shops
- On search, display multiple nearby shops
- Cluster or list view supported

#### 🛵 Nearby Riders
- Show available riders near searched location
- Useful for delivery/logistics apps

---

## 🧩 Map Providers (Pluggable)


## ⚙️ Architecture Overview

```txt
Map
├── Markers (Multiple Locations)
├── Routing
│   ├── From-To
│   └── Waypoints (Stops)
├── Search
│   ├── Nearby Shops
│   └── Nearby Riders
└── Map Provider


    |-OpenMapTiles
    |-OpenStreetMap
    |-Leaflet
    |-Mapilary
    |-Maplibre
    |-Maptiler
    |-LocationIQ
    |-MapCN
    |-Google Map