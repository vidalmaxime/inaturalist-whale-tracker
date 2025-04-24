"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Observation } from "@/services/api";

// Fix for Leaflet marker icons with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const SelectedIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [35, 51], // Larger for selected marker
  iconAnchor: [17, 51],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface ObservationMapProps {
  observations: Observation[];
  selectedObservation: Observation | null;
  onMarkerClick: (observation: Observation) => void;
}

export default function ObservationMap({
  observations,
  selectedObservation,
  onMarkerClick,
}: ObservationMapProps) {
  // Set default icon for all markers once component mounts
  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  // Calculate center of the map based on observations or default to a world view
  const center =
    observations.length > 0
      ? ([
          observations.reduce((sum, obs) => sum + obs.location[0], 0) /
            observations.length,
          observations.reduce((sum, obs) => sum + obs.location[1], 0) /
            observations.length,
        ] as [number, number])
      : ([0, 0] as [number, number]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={3}
        style={{ height: "100%", width: "100%", minHeight: "400px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {observations.map((observation) => (
          <Marker
            key={observation.id}
            position={[observation.location[0], observation.location[1]]}
            eventHandlers={{
              click: () => onMarkerClick(observation),
            }}
            icon={
              selectedObservation?.id === observation.id
                ? SelectedIcon
                : DefaultIcon
            }
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm">
                  {observation.species_guess}
                </h3>
                <p className="text-xs">{observation.observed_on}</p>
                <p className="text-xs">{observation.place_guess}</p>
                <p className="text-xs">Recorded by: {observation.user.name}</p>
                {observation.photos.length > 0 && (
                  <img
                    src={observation.photos[0].url}
                    alt={observation.species_guess}
                    className="mt-2 w-full max-h-32 object-cover rounded"
                  />
                )}
                <a
                  href={observation.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-xs text-blue-600 hover:underline"
                >
                  View on iNaturalist
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
