
import React, { useEffect, useRef, useState } from 'react';
import { Icons } from '../../constants';

interface MapProps {
    center: { lat: number; lng: number };
    zoom?: number;
    markers?: { lat: number; lng: number; title?: string; type?: 'courier' | 'pickup' | 'delivery' }[];
    className?: string;
    onMapClick?: (lat: number, lng: number) => void;
}

const MapComponent: React.FC<MapProps> = ({ center, zoom = 13, markers = [], className = '', onMapClick }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const [isLoadingLoc, setIsLoadingLoc] = useState(false);

    useEffect(() => {
        if (!mapRef.current) return;
        
        // Prevent re-initialization
        if (mapInstance.current) {
             mapInstance.current.setView([center.lat, center.lng], zoom);
             return;
        }

        if (typeof window !== 'undefined' && (window as any).L) {
            const L = (window as any).L;
            
            // Initialize map
            mapInstance.current = L.map(mapRef.current).setView([center.lat, center.lng], zoom);

            // Add tile layer (CartoDB Positron for a clean look)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(mapInstance.current);

            // Handle Map Click
            mapInstance.current.on('click', (e: any) => {
                if (onMapClick) {
                    onMapClick(e.latlng.lat, e.latlng.lng);
                }
            });
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    // Update map click listener when prop changes
    useEffect(() => {
        if (!mapInstance.current) return;
        mapInstance.current.off('click');
        mapInstance.current.on('click', (e: any) => {
            if (onMapClick) {
                onMapClick(e.latlng.lat, e.latlng.lng);
            }
        });
    }, [onMapClick]);

    // Update markers when they change
    useEffect(() => {
        if (!mapInstance.current || !(window as any).L) return;
        const L = (window as any).L;

        // Clear existing markers and polylines
        mapInstance.current.eachLayer((layer: any) => {
             if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                 mapInstance.current.removeLayer(layer);
             }
        });

        markers.forEach(marker => {
             const color = marker.type === 'courier' ? 'blue' : marker.type === 'pickup' ? 'green' : 'red';
             
             // Create a custom icon using pure CSS/HTML
             const iconHtml = `
                <div class="relative">
                    <div class="w-4 h-4 rounded-full bg-${color}-500 border-2 border-white shadow-lg animate-pulse"></div>
                    <div class="w-8 h-8 rounded-full bg-${color}-500/30 absolute -top-2 -left-2 -z-10"></div>
                </div>
             `;
             
             const customIcon = L.divIcon({
                 className: 'leaflet-div-icon',
                 html: iconHtml
             });

             L.marker([marker.lat, marker.lng], { icon: customIcon })
                .addTo(mapInstance.current)
                .bindPopup(marker.title || '');
        });

        // Draw Route line if there are pickup and delivery points (simplified logic)
        const pickup = markers.find(m => m.type === 'pickup');
        const delivery = markers.find(m => m.type === 'delivery');

        if (pickup && delivery) {
            const latlngs = [
                [pickup.lat, pickup.lng],
                [delivery.lat, delivery.lng]
            ];
            const polyline = L.polyline(latlngs, {color: '#3b82f6', weight: 4, opacity: 0.7, dashArray: '10, 10'}).addTo(mapInstance.current);
            mapInstance.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
        }

    }, [markers, center]);

    const handleLocateMe = () => {
        setIsLoadingLoc(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    if (mapInstance.current) {
                        mapInstance.current.setView([latitude, longitude], 15);
                        // Trigger click event to select this location if needed
                        if (onMapClick) {
                            onMapClick(latitude, longitude);
                        }
                    }
                    setIsLoadingLoc(false);
                },
                (error) => {
                    console.error("Error getting location", error);
                    alert("دسترسی به موقعیت مکانی امکان‌پذیر نیست.");
                    setIsLoadingLoc(false);
                }
            );
        } else {
            alert("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند.");
            setIsLoadingLoc(false);
        }
    };

    return (
        <div className="relative rounded-xl overflow-hidden z-0">
            <div ref={mapRef} className={`${className}`} style={{ minHeight: '300px' }} />
            
            {/* Geolocation Control */}
            {onMapClick && (
                <button
                    type="button"
                    onClick={handleLocateMe}
                    className="absolute bottom-4 right-4 z-[400] bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    title="پیدا کردن موقعیت من"
                >
                    {isLoadingLoc ? (
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <Icons.Crosshair className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                    )}
                </button>
            )}
        </div>
    );
};

export default MapComponent;