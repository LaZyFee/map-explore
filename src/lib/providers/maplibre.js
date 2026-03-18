import maplibregl from 'maplibre-gl';

// Get free API key from maptiler.com (100k requests/month free, no credit card)
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || 'YOUR_MAPTILER_KEY';

export const maplibreProvider = {
  mapInstance: null,
  markers: [],
  routeSource: null,

  initMap(containerId, center, zoom = 13) {
    this.mapInstance = new maplibregl.Map({
      container: containerId,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`,
      center: [center.lng, center.lat],
      zoom: zoom,
    });

    this.mapInstance.addControl(new maplibregl.NavigationControl());
    
    return this.mapInstance;
  },

  addMarkers(locations) {
    this.clearMarkers();
    
    locations.forEach((loc) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = 'white';
      el.style.fontWeight = 'bold';
      el.style.fontSize = '12px';
      el.style.cursor = 'pointer';
      
      // Different colors for types
      const colors = {
        user: '#3b82f6',
        shop: '#10b981',
        rider: '#f59e0b',
      };
      el.style.backgroundColor = colors[loc.type] || '#6b7280';
      el.textContent = loc.type === 'user' ? 'U' : loc.type === 'shop' ? 'S' : 'R';
      
      const marker = new maplibregl.Marker(el)
        .setLngLat([loc.lng, loc.lat])
        .setPopup(new maplibregl.Popup().setHTML(`<b>${loc.name}</b><br/>${loc.type}`))
        .addTo(this.mapInstance);
      
      this.markers.push(marker);
    });
  },

  clearMarkers() {
    this.markers.forEach((m) => m.remove());
    this.markers = [];
  },

  async drawRoute(from, to) {
    // Remove existing route
    if (this.mapInstance.getSource('route')) {
      this.mapInstance.removeLayer('route');
      this.mapInstance.removeSource('route');
    }
    
    // Fetch route from OSRM
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    
    try {
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.routes && data.routes[0]) {
        const coords = data.routes[0].geometry.coordinates;
        
        this.mapInstance.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
          },
        });
        
        this.mapInstance.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 5,
            'line-opacity': 0.8,
          },
        });
        
        // Fit bounds
        const bounds = coords.reduce((b, coord) => b.extend(coord), new maplibregl.LngLatBounds(coords[0], coords[0]));
        this.mapInstance.fitBounds(bounds, { padding: 50 });
      }
    } catch (e) {
      console.error('Routing error:', e);
      // Fallback line
      this.mapInstance.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [[from.lng, from.lat], [to.lng, to.lat]],
          },
        },
      });
      
      this.mapInstance.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        paint: {
          'line-color': '#ef4444',
          'line-width': 3,
          'line-dasharray': [2, 2],
        },
      });
    }
  },

  async drawSegmentedRoute(from, to, waypoints = []) {
    // Remove existing
    ['route-seg-0', 'route-seg-1', 'route-seg-2'].forEach((id) => {
      if (this.mapInstance.getLayer(id)) this.mapInstance.removeLayer(id);
      if (this.mapInstance.getSource(id)) this.mapInstance.removeSource(id);
    });
    
    const points = [from, ...waypoints, to];
    const colors = ['#3b82f6', '#10b981', '#f59e0b'];
    
    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];
      
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.routes && data.routes[0]) {
          const coords = data.routes[0].geometry.coordinates;
          const sourceId = `route-seg-${i}`;
          
          this.mapInstance.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: coords,
              },
            },
          });
          
          this.mapInstance.addLayer({
            id: sourceId,
            type: 'line',
            source: sourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': colors[i % colors.length],
              'line-width': 5,
              'line-opacity': 0.8,
            },
          });
        }
      } catch (e) {
        const sourceId = `route-seg-${i}`;
        this.mapInstance.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [[start.lng, start.lat], [end.lng, end.lat]],
            },
          },
        });
        
        this.mapInstance.addLayer({
          id: sourceId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': colors[i % colors.length],
            'line-width': 3,
            'line-dasharray': [2, 2],
          },
        });
      }
    }
  },

  searchNearby(query, center, radius = 5000) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = mockData.shops.filter((s) => 
          s.name.toLowerCase().includes(query.toLowerCase())
        );
        resolve(results);
      }, 300);
    });
  },

  destroy() {
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }
  }
};