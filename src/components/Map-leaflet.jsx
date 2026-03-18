'use client';

import { useEffect, useRef, useState } from 'react';
import { leafletProvider } from '@/lib/providers/leaflet';
import { mockData } from '@/lib/mockData';

export default function Map({ showShops = true, showRiders = true, segmentedRoute = false }) {
    const mapRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (!mapRef.current) return;

        leafletProvider.initMap(mapRef.current, { lat: mockData.user.lat, lng: mockData.user.lng }, 13);

        const markers = [mockData.user];
        if (showShops) markers.push(...mockData.shops);
        if (showRiders) markers.push(...mockData.riders);

        leafletProvider.addMarkers(markers);

        const { from, to, waypoints } = mockData.route;
        if (segmentedRoute && waypoints.length > 0) {
            leafletProvider.drawSegmentedRoute(from, to, waypoints);
        } else {
            leafletProvider.drawRoute(from, to);
        }

        return () => {
            leafletProvider.destroy();
        };
    }, [showShops, showRiders, segmentedRoute]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearching(true);
        setTimeout(() => {
            const results = mockData.shops.filter((s) =>
                s.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(results);
            setSearching(false);

            if (results.length > 0) {
                const markers = [mockData.user, ...results];
                if (showRiders) markers.push(...mockData.riders);
                leafletProvider.addMarkers(markers);
            }
        }, 200);
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Mono&display=swap');

                .leaflet-search-bar {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    position: absolute;
                    top: 16px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 1000;
                    width: min(480px, calc(100% - 32px));
                }

                .leaflet-search-form {
                    display: flex;
                    gap: 8px;
                    background: rgba(255,255,255,0.97);
                    border-radius: 14px;
                    padding: 8px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08);
                    border: 1px solid rgba(0,0,0,0.06);
                }

                .leaflet-search-input {
                    flex: 1;
                    border: none;
                    background: transparent;
                    padding: 6px 10px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 13px;
                    color: #1a1a2e;
                    outline: none;
                }

                .leaflet-search-input::placeholder { color: #aaa; }

                .leaflet-search-submit {
                    background: #1a1a2e;
                    color: #ffd23f;
                    border: none;
                    border-radius: 8px;
                    padding: 8px 16px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    letter-spacing: 0.03em;
                    transition: all 0.2s;
                    white-space: nowrap;
                }

                .leaflet-search-submit:hover {
                    background: #2d2d4e;
                    transform: scale(1.02);
                }

                .leaflet-results {
                    margin-top: 8px;
                    background: rgba(255,255,255,0.97);
                    border-radius: 12px;
                    padding: 12px 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
                    border: 1px solid rgba(0,0,0,0.06);
                    font-size: 13px;
                    color: #1a1a2e;
                    font-weight: 500;
                }

                .leaflet-results-label {
                    font-size: 10px;
                    font-family: 'Space Mono', monospace;
                    color: #888;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                }

                .leaflet-map-inner {
                    width: 100%;
                    height: 100%;
                    position: relative;
                }

                .leaflet-map-inner .map-div {
                    position: absolute;
                    inset: 0;
                }
            `}</style>

            <div style={{ flex: 1, width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <div className="leaflet-search-bar">
                    <form onSubmit={handleSearch} className="leaflet-search-form">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search nearby shops..."
                            className="leaflet-search-input"
                        />
                        <button type="submit" className="leaflet-search-submit" disabled={searching}>
                            {searching ? '...' : '🔍 Search'}
                        </button>
                    </form>

                    {searchResults.length > 0 && (
                        <div className="leaflet-results">
                            <div className="leaflet-results-label">Found {searchResults.length} result{searchResults.length > 1 ? 's' : ''}</div>
                            {searchResults.map(s => s.name).join(' · ')}
                        </div>
                    )}
                </div>

                <div ref={mapRef} style={{ position: 'absolute', inset: 0 }} />
            </div>
        </>
    );
}