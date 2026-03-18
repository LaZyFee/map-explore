'use client';

import { useState, useEffect } from 'react';
import { mockData } from '../lib/mockData';

// Uses useEffect mount guard instead of next/dynamic to avoid Turbopack module resolution issues
function MapLibreMap({ showShops, showRiders, segmentedRoute }) {
    const [MapComponent, setMapComponent] = useState(null);

    useEffect(() => {
        import('./Map-maplibre').then((mod) => {
            setMapComponent(() => mod.default);
        });
    }, []);

    if (!MapComponent) {
        return (
            <div style={{
                flex: 1, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                background: '#0f1923', color: 'rgba(255,255,255,0.3)',
                fontFamily: "'DM Mono', monospace", fontSize: 13,
                letterSpacing: '0.05em',
            }}>
                Loading map…
            </div>
        );
    }

    return <MapComponent showShops={showShops} showRiders={showRiders} segmentedRoute={segmentedRoute} />;
}

export default function MapMaplibreWrapper() {
    const [showShops, setShowShops] = useState(true);
    const [showRiders, setShowRiders] = useState(true);
    const [segmentedRoute, setSegmentedRoute] = useState(false);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
                .maplibre-wrapper {
                    font-family: 'DM Sans', sans-serif;
                    height: 100vh; display: flex; flex-direction: column;
                    background: #0f1923; color: #e8f4f8;
                    position: relative; overflow: hidden;
                }
                .maplibre-wrapper::before {
                    content: ''; position: absolute;
                    top: -200px; right: -200px;
                    width: 500px; height: 500px;
                    background: radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%);
                    pointer-events: none; z-index: 0;
                }
                .maplibre-topbar {
                    position: relative; z-index: 20;
                    display: flex; align-items: center;
                    height: 68px; padding: 0 24px;
                    background: rgba(15,25,35,0.9);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(56,189,248,0.1);
                }
                .ml-brand {
                    display: flex; align-items: center; gap: 10px;
                    padding-right: 24px;
                    border-right: 1px solid rgba(255,255,255,0.08);
                    margin-right: 24px;
                }
                .ml-brand-icon {
                    width: 36px; height: 36px;
                    background: linear-gradient(135deg, #38bdf8, #818cf8);
                    border-radius: 10px; display: flex;
                    align-items: center; justify-content: center;
                    font-size: 18px; box-shadow: 0 4px 12px rgba(56,189,248,0.25);
                }
                .ml-brand-text { display: flex; flex-direction: column; }
                .ml-brand-name {
                    font-size: 15px; font-weight: 700; color: #fff;
                    letter-spacing: -0.02em; line-height: 1;
                }
                .ml-brand-sub {
                    font-family: 'DM Mono', monospace; font-size: 9px;
                    color: #38bdf8; letter-spacing: 0.1em;
                    text-transform: uppercase; margin-top: 2px;
                }
                .ml-pills { display: flex; gap: 6px; align-items: center; }
                .ml-pill {
                    display: flex; align-items: center; gap: 8px;
                    padding: 7px 16px; border-radius: 100px;
                    font-size: 13px; font-weight: 500; cursor: pointer;
                    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
                    border: 1.5px solid rgba(255,255,255,0.08);
                    background: rgba(255,255,255,0.04);
                    color: rgba(255,255,255,0.5); user-select: none;
                }
                .ml-pill:hover {
                    background: rgba(255,255,255,0.08);
                    color: rgba(255,255,255,0.8);
                    border-color: rgba(255,255,255,0.15);
                }
                .ml-pill.on {
                    background: rgba(56,189,248,0.12);
                    border-color: rgba(56,189,248,0.35); color: #38bdf8;
                }
                .ml-pill.on.route {
                    background: rgba(129,140,248,0.12);
                    border-color: rgba(129,140,248,0.35); color: #818cf8;
                }
                .ml-pill-dot {
                    width: 7px; height: 7px; border-radius: 50%;
                    background: currentColor; opacity: 0.7;
                }
                .ml-pill.on .ml-pill-dot { opacity: 1; box-shadow: 0 0 6px currentColor; }
                .ml-spacer { flex: 1; }
                .ml-coords {
                    font-family: 'DM Mono', monospace; font-size: 11px;
                    color: rgba(255,255,255,0.25); padding: 6px 12px;
                    background: rgba(255,255,255,0.04); border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.06); letter-spacing: 0.02em;
                }
                .maplibre-body {
                    flex: 1; position: relative; overflow: hidden;
                    z-index: 1; display: flex; flex-direction: column;
                }
            `}</style>

            <div className="maplibre-wrapper">
                <header className="maplibre-topbar">
                    <div className="ml-brand">
                        <div className="ml-brand-text">
                            <div className="ml-brand-sub">MapLibre GL</div>
                        </div>
                    </div>
                    <div className="ml-pills">
                        <div className={`ml-pill ${showShops ? 'on' : ''}`} onClick={() => setShowShops(v => !v)}>
                            <div className="ml-pill-dot" /> 🛒 Shops
                        </div>
                        <div className={`ml-pill ${showRiders ? 'on' : ''}`} onClick={() => setShowRiders(v => !v)}>
                            <div className="ml-pill-dot" /> 🏍️ Riders
                        </div>
                        <div className={`ml-pill route ${segmentedRoute ? 'on' : ''}`} onClick={() => setSegmentedRoute(v => !v)}>
                            <div className="ml-pill-dot" /> A→B→C Route
                        </div>
                    </div>
                    <div className="ml-spacer" />
                    <div className="ml-coords">
                        {mockData.user.lat}°N · {mockData.user.lng}°E
                    </div>
                </header>

                <div className="maplibre-body">
                    <MapLibreMap
                        showShops={showShops}
                        showRiders={showRiders}
                        segmentedRoute={segmentedRoute}
                    />
                </div>
            </div>
        </>
    );
}