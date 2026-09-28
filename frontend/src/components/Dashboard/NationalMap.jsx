import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Eye,
  RotateCcw
} from 'lucide-react';

// Free, reliable basemaps with NO API KEY REQUIRED
const BASEMAP_TILES = {
  osm: {
    name: 'Detailed Street (OSM)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  },
  satellite: {
    name: 'Satellite (Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    subdomains: [],
    attribution: 'Tiles &copy; Esri',
    maxZoom: 18
  }
};

// Event Types palette
const EVENT_TYPES = [
  { name: 'Rainfall', color: '#0284c7' },
  { name: 'Thunderstorm', color: '#7c3aed' },
  { name: 'Flooding', color: '#00b4d8' },
  { name: 'Heatwave', color: '#dc2626' },
  { name: 'Fog', color: '#059669' },
  { name: 'Dust Storm', color: '#d97706' },
  { name: 'Strong Winds', color: '#0d9488' },
  { name: 'Cyclone', color: '#e11d48' },
  { name: 'Other', color: '#475569' }
];

// Helper to return crisp 13x13 SVG logo for each weather category
const getCategorySvgLogo = (category, color) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('rain')) {
    return `<path d="M4 2.5C4 1.7 4.7 1 5.5 1C6.2 1 6.8 1.5 7 2.1C7.3 2 7.6 2 8 2C9.1 2 10 2.9 10 4C10 4.1 10 4.2 10 4.3C10.6 4.7 11 5.3 11 6C11 7.1 10.1 8 9 8H3C1.9 8 1 7.1 1 6C1 5.1 1.6 4.3 2.5 4.1C2.5 4 2.5 3.8 2.5 3.7C2.5 2.5 3.4 1.5 4.5 1.5M4 9.5L3 11.5M6 9.5L5 11.5M8 9.5L7 11.5" stroke="${color}" stroke-width="1.3" stroke-linecap="round" fill="none"/>`;
  }
  if (cat.includes('flood')) {
    return `<path d="M1 4.5C2.5 3.5 3.5 5.5 5 4.5C6.5 3.5 7.5 5.5 9 4.5C10.5 3.5 11.5 5.5 12 4.5M1 7.5C2.5 6.5 3.5 8.5 5 7.5C6.5 6.5 7.5 8.5 9 7.5C10.5 6.5 11.5 8.5 12 7.5M1 10.5C2.5 9.5 3.5 11.5 5 10.5C6.5 9.5 7.5 11.5 9 10.5" stroke="${color}" stroke-width="1.4" stroke-linecap="round" fill="none"/>`;
  }
  if (cat.includes('thunder') || cat.includes('lightning')) {
    return `<path d="M2 4C2 2.9 2.9 2 4 2C4.5 1.4 5.2 1 6 1C7.1 1 8 1.9 8 3C8.6 3.2 9 3.8 9 4.5C9 5.3 8.3 6 7.5 6H3C2.4 6 2 5.6 2 5ZM5.5 6L3.5 9.5H6.5L4.5 13" stroke="${color}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  }
  if (cat.includes('heat')) {
    return `<circle cx="6.5" cy="6.5" r="3" fill="${color}"/><path d="M6.5 1.5V2.5M6.5 10.5V11.5M1.5 6.5H2.5M10.5 6.5H11.5M3 3L3.7 3.7M9.3 9.3L10 10M3 10L3.7 9.3M9.3 3.7L10 3" stroke="${color}" stroke-width="1.3" stroke-linecap="round"/>`;
  }
  if (cat.includes('fog')) {
    return `<path d="M2 3.5H11M1 6.5H12M3 9.5H10" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>`;
  }
  if (cat.includes('wind') || cat.includes('cyclone') || cat.includes('dust')) {
    return `<path d="M1 3.5H8.5C9.6 3.5 10.5 4.4 10.5 5.5C10.5 6.6 9.6 7.5 8.5 7.5M1 6.5H9.5C10.6 6.5 11.5 7.4 11.5 8.5C11.5 9.6 10.6 10.5 9.5 10.5M1 9.5H6" stroke="${color}" stroke-width="1.4" stroke-linecap="round" fill="none"/>`;
  }
  // Default sensor beacon
  return `<circle cx="6.5" cy="6.5" r="2.5" fill="${color}"/><path d="M3.5 3.5A4.5 4.5 0 0 1 9.5 3.5M2 2A6.5 6.5 0 0 1 11 2" stroke="${color}" stroke-width="1.3" stroke-linecap="round" fill="none"/>`;
};

// 🌟 AUTHENTIC TEARDROP MAP PIN LOGO MARKER CREATOR 🌟
const createMarkerIcon = (category, trustScore, status, isSelected = false) => {
  const matchedType = EVENT_TYPES.find(
    (t) => t.name.toLowerCase() === category?.toLowerCase()
  );
  const baseColor = matchedType ? matchedType.color : '#0284c7';

  let ringColor = '#10b981'; // Green for high trust (>=75%)
  if (trustScore < 40.0) {
    ringColor = '#dc2626'; // Red for low trust / fake
  } else if (trustScore < 75.0) {
    ringColor = '#d97706'; // Amber for pending review
  }

  const isVerified = status === 'VERIFIED';
  const width = isSelected ? 34 : 28;
  const height = isSelected ? 42 : 36;
  const logoSvg = getCategorySvgLogo(category, baseColor);

  const html = `
    <div style="position: relative; width: ${width}px; height: ${height}px; cursor: pointer; transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);">
      ${isSelected ? `<div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 14px; height: 14px; border-radius: 50%; background: ${baseColor}; opacity: 0.6; animation: ping 1.5s infinite;"></div>` : ''}
      <svg width="${width}" height="${height}" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 5px rgba(0,0,0,0.35)); display: block;">
        <!-- Teardrop Pin Body -->
        <path d="M14 0.8C6.71 0.8 0.8 6.71 0.8 14C0.8 24.2 14 35.2 14 35.2C14 35.2 27.2 24.2 27.2 14C27.2 6.71 21.29 0.8 14 0.8Z"
          fill="${baseColor}"
          stroke="${ringColor}"
          stroke-width="${isVerified ? '2' : '1.8'}"
          ${!isVerified ? 'stroke-dasharray="3 2"' : ''}
        />
        <!-- Inner Crisp White Badge -->
        <circle cx="14" cy="13.5" r="8" fill="#ffffff" stroke="${ringColor}" stroke-width="0.8"/>
        <!-- Weather Hazard Logo Inside Pin -->
        <g transform="translate(7.5, 7)">
          ${logoSvg}
        </g>
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-map-pin-logo-marker',
    iconSize: [width, height],
    iconAnchor: [width / 2, height] // Anchors directly on the bottom tip of the pin!
  });
};

// Map Initializer: forces Leaflet to calculate container size immediately
function MapInitializer() {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    const t1 = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    const t2 = setTimeout(() => {
      map.invalidateSize();
    }, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [map]);

  return null;
}

// Map View Controller: only triggers when filtered bounds exist
function MapViewController({ bounds }) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      if (bounds.length === 1) {
        map.flyTo(bounds[0], 9, { duration: 1.0 });
      } else {
        const leafletBounds = L.latLngBounds(bounds);
        map.fitBounds(leafletBounds, { padding: [60, 60], maxZoom: 11, duration: 1.0 });
      }
    }
  }, [bounds, map]);

  return null;
}

export default function NationalMap({ events, h3Clusters, onSelectEvent }) {
  // Default to OSM (100% free, no API key, exactly matching user reference photo)
  const [selectedStyle, setSelectedStyle] = useState('osm');
  const [showH3, setShowH3] = useState(true);
  const [showPins, setShowPins] = useState(true);

  // Active filter state
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { ALL: events?.length || 0 };
    if (events) {
      for (const ev of events) {
        counts[ev.category] = (counts[ev.category] || 0) + 1;
      }
    }
    return counts;
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    if (activeCategory === 'ALL') return events;
    return events.filter(
      (ev) => ev.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [events, activeCategory]);

  // Filter H3 clusters
  const filteredClusters = useMemo(() => {
    if (!h3Clusters) return [];
    if (activeCategory === 'ALL') return h3Clusters;
    return h3Clusters.filter(
      (c) => c.categories && c.categories[activeCategory] && c.categories[activeCategory] > 0
    );
  }, [h3Clusters, activeCategory]);

  // Target bounds: only calculate when a specific category is chosen
  const targetBounds = useMemo(() => {
    if (activeCategory === 'ALL' || filteredEvents.length === 0) return null;
    return filteredEvents.map((ev) => [ev.latitude, ev.longitude]);
  }, [filteredEvents, activeCategory]);

  const currentBasemap = BASEMAP_TILES[selectedStyle] || BASEMAP_TILES.osm;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[580px] relative">
      {/* Map Header */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Live Event Map
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-mono font-bold">
            {filteredEvents.length} Active Events Visible
          </span>
        </div>

        {/* Right Header Controls: Basemap Style & Overlays */}
        <div className="flex items-center gap-2">
          {/* Quick Basemap Toggle: Detailed Street vs Satellite */}
          <div className="flex items-center bg-white rounded-lg p-0.5 border border-command-border text-[11px] shadow-sm">
            <button
              onClick={() => setSelectedStyle('osm')}
              className={`px-2.5 py-0.5 rounded transition-colors text-[10px] font-bold ${
                selectedStyle === 'osm'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Street (OSM)
            </button>
            <button
              onClick={() => setSelectedStyle('satellite')}
              className={`px-2.5 py-0.5 rounded transition-colors text-[10px] font-bold ${
                selectedStyle === 'satellite'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
          </div>

          <button
            onClick={() => setShowH3(!showH3)}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm ${
              showH3
                ? 'bg-blue-100 text-blue-800 border border-blue-300 font-bold'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <span>H3 Hex</span>
            <span className="text-[9px] px-1 rounded bg-slate-100 font-mono">{filteredClusters.length}</span>
          </button>
          <button
            onClick={() => setShowPins(!showPins)}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1.5 shadow-sm ${
              showPins
                ? 'bg-blue-100 text-blue-800 border border-blue-300 font-bold'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <span>Pins</span>
            <span className="text-[9px] px-1 rounded bg-slate-100 font-mono">{filteredEvents.length}</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas with Fixed Pixel Height (Prevents 0px Flex Collapse) */}
      <div className="w-full h-[530px] min-h-[500px] relative bg-[#f8fafc] overflow-hidden">
        <MapContainer
          center={[22.5, 80.0]}
          zoom={5}
          maxZoom={currentBasemap.maxZoom}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '530px', minHeight: '500px' }}
        >
          {/* Map Initializer: Forces invalidateSize() so canvas renders immediately */}
          <MapInitializer />

          {/* Basemap Tile Layer - 100% Free, No API Key Required */}
          <TileLayer
            key={selectedStyle}
            attribution={currentBasemap.attribution}
            url={currentBasemap.url}
            subdomains={currentBasemap.subdomains}
            maxZoom={currentBasemap.maxZoom}
            maxNativeZoom={currentBasemap.maxZoom}
          />

          {/* Auto-focus controller on filter */}
          <MapViewController bounds={targetBounds} />

          {/* Uber H3 Hexagonal Grid Polygons */}
          {showH3 &&
            filteredClusters.map((cluster) => {
              if (!cluster.boundary || cluster.boundary.length === 0) return null;
              const isCrit = cluster.critical_count > 0;
              const fillColor = isCrit ? '#ef4444' : cluster.count > 2 ? '#f97316' : '#06b6d4';
              return (
                <Polygon
                  key={cluster.h3_index}
                  positions={cluster.boundary}
                  pathOptions={{
                    color: fillColor,
                    weight: 1.8,
                    fillColor: fillColor,
                    fillOpacity: isCrit ? 0.45 : 0.22
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>Uber H3 Hex Cluster</span>
                        <span className="text-[9px] font-mono text-cyan-400">
                          {cluster.h3_index.slice(0, 10)}...
                        </span>
                      </div>
                      <div className="text-slate-300">
                        Region: <b className="text-white">{cluster.city}, {cluster.state}</b>
                      </div>
                      <div className="text-slate-300">
                        Events Density: <b className="text-cyan-400">{cluster.count}</b> (Critical: {cluster.critical_count})
                      </div>
                      <div className="text-slate-300">
                        Avg TrustScore: <b className="text-emerald-400">{cluster.avg_trust}%</b>
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}

          {/* Real-time Weather Pinpoints */}
          {showPins &&
            filteredEvents.map((ev) => (
              <Marker
                key={ev.id}
                position={[ev.latitude, ev.longitude]}
                icon={createMarkerIcon(ev.category, ev.trust_score, ev.verification_status, activeCategory !== 'ALL')}
              >
                <Popup>
                  <div className="text-xs space-y-2 min-w-[220px]">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                      <span className="font-bold uppercase text-[10px] tracking-wider text-cyan-400">
                        {ev.category}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          ev.severity === 'Critical'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : ev.severity === 'High'
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {ev.severity}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs leading-tight mb-1">{ev.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{ev.description}</p>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>{ev.city}, {ev.state}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[10px] bg-slate-50 p-1.5 rounded border border-slate-200 font-mono">
                      <div>
                        <span className="text-slate-500">Source: </span>
                        <span className="text-slate-900 font-semibold">{ev.source}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Trust: </span>
                        <span className="text-emerald-700 font-bold">{ev.trust_score}%</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectEvent(ev.id)}
                      className="w-full mt-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect AI Truth & Evidence</span>
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>

        {/* 🌟 FLOATING "EVENT TYPES" BOX (MATCHING USER SCREENSHOT) 🌟 */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-xl w-60 sm:w-64 space-y-2">
          {/* Header with Title & Reset Button */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <span className="text-xs font-bold text-slate-900 tracking-wide">
              Event Types
            </span>
            {activeCategory !== 'ALL' && (
              <button
                onClick={() => setActiveCategory('ALL')}
                className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                title="Reset to view all events"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Show All</span>
              </button>
            )}
          </div>

          {/* 2-Column Event Types Grid matching screenshot with raised active animation */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
            {EVENT_TYPES.map((type) => {
              const isSelected = activeCategory.toLowerCase() === type.name.toLowerCase();
              const count = categoryCounts[type.name] || 0;

              return (
                <button
                  key={type.name}
                  onClick={() => setActiveCategory(isSelected ? 'ALL' : type.name)}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg transition-all duration-300 transform text-left ${
                    isSelected
                      ? 'bg-blue-50 text-blue-800 border border-blue-400 font-bold shadow-sm -translate-y-0.5'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {/* Mini Map Pin Logo with Hazard Symbol */}
                    <svg
                      width="14"
                      height="18"
                      viewBox="0 0 28 36"
                      fill="none"
                      className="shrink-0 transition-transform duration-200"
                      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))' }}
                    >
                      <path
                        d="M14 0.8C6.71 0.8 0.8 6.71 0.8 14C0.8 24.2 14 35.2 14 35.2C14 35.2 27.2 24.2 27.2 14C27.2 6.71 21.29 0.8 14 0.8Z"
                        fill={type.color}
                        stroke="#ffffff"
                        strokeWidth="1.2"
                      />
                      <circle cx="14" cy="13.5" r="7.5" fill="#ffffff" />
                      <g
                        transform="translate(7.5, 7)"
                        dangerouslySetInnerHTML={{ __html: getCategorySvgLogo(type.name, type.color) }}
                      />
                    </svg>
                    <span className="truncate">{type.name}</span>
                  </div>
                  {count > 0 && (
                    <span className={`text-[9px] font-mono ml-1 ${isSelected ? 'text-blue-800 font-bold' : 'text-slate-500'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
