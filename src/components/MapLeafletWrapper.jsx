'use client';

import { useState, useEffect } from 'react';
import { mockData } from '../lib/mockData';

function LeafletMap({ showShops, showRiders, segmentedRoute }) {
    const [MapComponent, setMapComponent] = useState(null);

    useEffect(() => {
        import('./Map-leaflet').then((mod) => {
            setMapComponent(() => mod.default);
        });
    }, []);

    if (!MapComponent) {
        return (
            <div style={{
                flex: 1, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                background: '#f5f0e8', color: '#aaa',
                fontFamily: "'Space Mono', monospace", fontSize: 13,
            }}>
                Loading map…
            </div>
        );
    }

    return <MapComponent showShops={showShops} showRiders={showRiders} segmentedRoute={segmentedRoute} />;
}

export default function MapLeafletWrapper() {
    const [showShops, setShowShops] = useState(true);
    const [showRiders, setShowRiders] = useState(true);
    const [segmentedRoute, setSegmentedRoute] = useState(false);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
                .leaflet-wrapper {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    height: 100vh; display: flex; flex-direction: column;
                    background: #f5f0e8; color: #1a1a2e;
                }
                .leaflet-header {
                    background: #1a1a2e; padding: 0 32px;
                    display: flex; align-items: center; gap: 32px;
                    height: 64px; flex-shrink: 0;
                    position: relative; overflow: hidden;
                }
                .leaflet-header::after {
                    content: ''; position: absolute;
                    bottom: 0; left: 0; right: 0; height: 2px;
                    background: linear-gradient(90deg, #ff6b35, #ffd23f, #ff6b35);
                    background-size: 200% 100%;
                    animation: lf-shimmer 3s infinite;
                }
                @keyframes lf-shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .leaflet-logo {
                    font-size: 18px; font-weight: 800; color: #fff;
                    letter-spacing: -0.03em; white-space: nowrap;
                    display: flex; align-items: center; gap: 8px;
                }
                .leaflet-logo-accent { color: #ffd23f; }
                .leaflet-logo-tag {
                    font-family: 'Space Mono', monospace; font-size: 9px;
                    color: rgba(255,255,255,0.4); font-weight: 400;
                    letter-spacing: 0.1em; text-transform: uppercase;
                    padding: 2px 8px; border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 4px; margin-left: 4px;
                }
                .leaflet-divider {
                    width: 1px; height: 24px;
                    background: rgba(255,255,255,0.1); flex-shrink: 0;
                }
                .leaflet-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
                .ctrl-chip {
                    display: flex; align-items: center; gap: 8px;
                    padding: 6px 14px; border-radius: 8px; cursor: pointer;
                    font-size: 13px; font-weight: 600;
                    transition: all 0.2s;
                    border: 1.5px solid rgba(255,255,255,0.1);
                    background: rgba(255,255,255,0.05);
                    color: rgba(255,255,255,0.6); user-select: none;
                }
                .ctrl-chip:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9); }
                .ctrl-chip.active {
                    background: rgba(255,210,63,0.15);
                    border-color: rgba(255,210,63,0.4); color: #ffd23f;
                }
                .ctrl-check {
                    width: 16px; height: 16px; border-radius: 4px;
                    border: 1.5px solid currentColor;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 10px; transition: all 0.2s;
                }
                .ctrl-chip.active .ctrl-check {
                    background: #ffd23f; border-color: #ffd23f; color: #1a1a2e;
                }
                .leaflet-loc-info {
                    margin-left: auto;
                    font-family: 'Space Mono', monospace; font-size: 10px;
                    color: rgba(255,255,255,0.3); letter-spacing: 0.03em; white-space: nowrap;
                }
                .leaflet-map-container {
                    flex: 1; position: relative; overflow: hidden; display: flex; flex-direction: column;
                }
            `}</style>

            <div className="leaflet-wrapper">
                <header className="leaflet-header">
                    <div className="leaflet-logo">
                        <span className="leaflet-logo-tag">Leaflet + OSM</span>
                    </div>
                    <div className="leaflet-divider" />
                    <div className="leaflet-controls">
                        <div className={`ctrl-chip ${showShops ? 'active' : ''}`} onClick={() => setShowShops(v => !v)}>
                            <div className="ctrl-check">{showShops ? '✓' : ''}</div>
                            🛒 Shops
                        </div>
                        <div className={`ctrl-chip ${showRiders ? 'active' : ''}`} onClick={() => setShowRiders(v => !v)}>
                            <div className="ctrl-check">{showRiders ? '✓' : ''}</div>
                            🏍️ Riders
                        </div>
                        <div className={`ctrl-chip ${segmentedRoute ? 'active' : ''}`} onClick={() => setSegmentedRoute(v => !v)}>
                            <div className="ctrl-check">{segmentedRoute ? '✓' : ''}</div>
                            ⛓ Segmented A→B→C
                        </div>
                    </div>
                    <div className="leaflet-loc-info">
                        📍 {mockData.user.lat}°N · {mockData.user.lng}°E · Chattogram
                    </div>
                </header>

                <div className="leaflet-map-container">
                    <LeafletMap showShops={showShops} showRiders={showRiders} segmentedRoute={segmentedRoute} />
                </div>
            </div>
        </>
    );
}