"use client";
import { useEffect, useRef, useState } from "react";
import { initMap, addMarkers, searchNearby, removeMap } from "../lib/providers/maptiler";
import { mockData } from "../lib/mockData";

export default function MapMaptilerWrapper() {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const userMarkersRef = useRef([]);
    const shopMarkersRef = useRef([]);
    const riderMarkersRef = useRef([]);

    const [showShops, setShowShops] = useState(true);
    const [showRiders, setShowRiders] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const updateMarkers = () => {
        if (!mapInstance.current) return;
        const map = mapInstance.current;

        shopMarkersRef.current.forEach((m) => m.remove());
        shopMarkersRef.current = [];
        if (showShops) {
            const nearby = searchNearby(searchQuery);
            shopMarkersRef.current = addMarkers(map, nearby.shops, "shop");
        }

        riderMarkersRef.current.forEach((m) => m.remove());
        riderMarkersRef.current = [];
        if (showRiders) {
            const nearby = searchNearby(searchQuery);
            riderMarkersRef.current = addMarkers(map, nearby.riders, "rider");
        }
    };

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;
        const map = initMap("map-container", mockData.user, 14);
        mapInstance.current = map;
        userMarkersRef.current = addMarkers(map, [mockData.user], "user");
        updateMarkers();
        return () => { if (map) removeMap(map); };
    }, []);

    useEffect(() => {
        if (mapInstance.current) updateMarkers();
    }, [showShops, showRiders, searchQuery]);

    const handleSearch = () => {
        setSearchQuery(searchInput);
    };

    const stats = [
        { label: "Shops", value: mockData.shops.length, color: "#e74c3c", icon: "🛒" },
        { label: "Riders", value: mockData.riders.filter(r => r.status === 'available').length, color: "#2ecc71", icon: "🏍️" },
        { label: "Active", value: mockData.riders.length, color: "#f39c12", icon: "📍" },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

                .maptiler-wrapper * { box-sizing: border-box; }
                .maptiler-wrapper {
                    font-family: 'Syne', sans-serif;
                    display: flex;
                    height: 100vh;
                    background: #080c14;
                    color: #e8eaf0;
                    overflow: hidden;
                }

                .sidebar {
                    width: 300px;
                    min-width: 300px;
                    background: linear-gradient(180deg, #0d1520 0%, #0a1018 100%);
                    border-right: 1px solid rgba(99, 179, 237, 0.12);
                    display: flex;
                    flex-direction: column;
                    padding: 0;
                    overflow: hidden;
                    position: relative;
                    z-index: 10;
                }

                .sidebar::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #63b3ed, #4fd1c5, transparent);
                }

                .sidebar-header {
                    padding: 28px 24px 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }

                .brand-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(99,179,237,0.1);
                    border: 1px solid rgba(99,179,237,0.25);
                    border-radius: 20px;
                    padding: 4px 12px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 10px;
                    color: #63b3ed;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 12px;
                }

                .brand-dot {
                    width: 6px; height: 6px;
                    background: #4fd1c5;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.8); }
                }

                .sidebar-title {
                    font-size: 22px;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    color: #f0f4ff;
                    line-height: 1.2;
                }

                .sidebar-title span {
                    color: #63b3ed;
                }

                .sidebar-subtitle {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 11px;
                    color: rgba(255,255,255,0.3);
                    margin-top: 6px;
                    letter-spacing: 0.05em;
                }

                .stats-row {
                    display: flex;
                    gap: 8px;
                    padding: 16px 24px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }

                .stat-card {
                    flex: 1;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 10px;
                    padding: 10px 8px;
                    text-align: center;
                    transition: all 0.2s;
                }

                .stat-card:hover {
                    background: rgba(99,179,237,0.08);
                    border-color: rgba(99,179,237,0.2);
                }

                .stat-value {
                    font-size: 20px;
                    font-weight: 800;
                    line-height: 1;
                }

                .stat-label {
                    font-size: 9px;
                    color: rgba(255,255,255,0.4);
                    margin-top: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }

                .sidebar-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px 24px;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(99,179,237,0.2) transparent;
                }

                .search-box {
                    position: relative;
                    margin-bottom: 20px;
                }

                .search-input {
                    width: 100%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    padding: 12px 48px 12px 16px;
                    color: #e8eaf0;
                    font-family: 'Syne', sans-serif;
                    font-size: 13px;
                    outline: none;
                    transition: all 0.2s;
                }

                .search-input::placeholder { color: rgba(255,255,255,0.25); }
                .search-input:focus {
                    border-color: rgba(99,179,237,0.4);
                    background: rgba(99,179,237,0.05);
                    box-shadow: 0 0 0 3px rgba(99,179,237,0.08);
                }

                .search-btn {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: linear-gradient(135deg, #63b3ed, #4fd1c5);
                    border: none;
                    border-radius: 8px;
                    width: 32px;
                    height: 32px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .search-btn:hover {
                    transform: translateY(-50%) scale(1.05);
                    box-shadow: 0 4px 12px rgba(99,179,237,0.3);
                }

                .section-label {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.3);
                    margin-bottom: 10px;
                }

                .toggle-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 24px;
                }

                .toggle-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 10px;
                    padding: 10px 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .toggle-item:hover {
                    background: rgba(255,255,255,0.06);
                }

                .toggle-item.active {
                    background: rgba(99,179,237,0.08);
                    border-color: rgba(99,179,237,0.2);
                }

                .toggle-left {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 13px;
                    font-weight: 600;
                    color: rgba(255,255,255,0.8);
                }

                .toggle-switch {
                    width: 36px;
                    height: 20px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                    position: relative;
                    transition: background 0.2s;
                }

                .toggle-item.active .toggle-switch {
                    background: linear-gradient(90deg, #63b3ed, #4fd1c5);
                }

                .toggle-knob {
                    position: absolute;
                    width: 14px; height: 14px;
                    background: white;
                    border-radius: 50%;
                    top: 3px;
                    left: 3px;
                    transition: transform 0.2s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                }

                .toggle-item.active .toggle-knob {
                    transform: translateX(16px);
                }

                .location-card {
                    background: rgba(79,209,197,0.06);
                    border: 1px solid rgba(79,209,197,0.15);
                    border-radius: 12px;
                    padding: 14px;
                    margin-bottom: 20px;
                }

                .location-title {
                    font-size: 11px;
                    color: #4fd1c5;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 8px;
                }

                .location-name {
                    font-size: 15px;
                    font-weight: 700;
                    color: #f0f4ff;
                }

                .location-coords {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 10px;
                    color: rgba(255,255,255,0.3);
                    margin-top: 4px;
                }

                .entity-list {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .entity-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 12px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 8px;
                    font-size: 12px;
                    transition: all 0.15s;
                }

                .entity-item:hover {
                    background: rgba(255,255,255,0.05);
                    border-color: rgba(255,255,255,0.1);
                    transform: translateX(3px);
                }

                .entity-dot {
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                .entity-name {
                    flex: 1;
                    color: rgba(255,255,255,0.75);
                    font-weight: 500;
                }

                .entity-status {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 9px;
                    padding: 2px 7px;
                    border-radius: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .status-available {
                    background: rgba(46,204,113,0.15);
                    color: #2ecc71;
                    border: 1px solid rgba(46,204,113,0.2);
                }

                .status-busy {
                    background: rgba(231,76,60,0.15);
                    color: #e74c3c;
                    border: 1px solid rgba(231,76,60,0.2);
                }

                .map-area {
                    flex: 1;
                    position: relative;
                    overflow: hidden;
                }

                #map-container {
                    position: absolute;
                    inset: 0;
                }

                .map-overlay-badge {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    z-index: 10;
                    background: rgba(8,12,20,0.85);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(99,179,237,0.2);
                    border-radius: 10px;
                    padding: 8px 14px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 11px;
                    color: #63b3ed;
                    pointer-events: none;
                    letter-spacing: 0.05em;
                }

                .sidebar-footer {
                    padding: 16px 24px;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 10px;
                    color: rgba(255,255,255,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .live-indicator {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .live-dot {
                    width: 6px; height: 6px;
                    background: #2ecc71;
                    border-radius: 50%;
                    animation: pulse 1.5s infinite;
                }
            `}</style>

            <div className="maptiler-wrapper">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <div className="brand-badge">
                            <div className="brand-dot" />
                            MapTiler SDK
                        </div>
                    </div>

                    <div className="sidebar-body">
                        {/* Location */}
                        <div className="location-card">
                            <div className="location-title">📍 Your Location</div>
                            <div className="location-name">Chattogram, BD</div>
                            <div className="location-coords">{mockData.user.lat}°N, {mockData.user.lng}°E</div>
                        </div>

                        {/* Search */}
                        <div className="search-box">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search shops or riders..."
                                className="search-input"
                            />
                            <button onClick={handleSearch} className="search-btn">🔍</button>
                        </div>

                        {/* Toggles */}
                        <div className="section-label">Layers</div>
                        <div className="toggle-group">
                            <div
                                className={`toggle-item ${showShops ? 'active' : ''}`}
                                onClick={() => setShowShops(!showShops)}
                            >
                                <div className="toggle-left">🛒 Shops</div>
                                <div className="toggle-switch"><div className="toggle-knob" /></div>
                            </div>
                            <div
                                className={`toggle-item ${showRiders ? 'active' : ''}`}
                                onClick={() => setShowRiders(!showRiders)}
                            >
                                <div className="toggle-left">🏍️ Riders</div>
                                <div className="toggle-switch"><div className="toggle-knob" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-footer">
                        <div className="live-indicator">
                            <div className="live-dot" />
                            LIVE
                        </div>
                        <span>MapTiler · OSM</span>
                    </div>
                </aside>

                {/* Map */}
                <div className="map-area">
                    <div id="map-container" ref={mapRef} />
                    <div className="map-overlay-badge">🗺 Chattogram · 22.3569°N 91.7832°E</div>
                </div>
            </div>
        </>
    );
}