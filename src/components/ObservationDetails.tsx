"use client";

import React from "react";
import { Observation } from "@/services/api";

interface ObservationDetailsProps {
  observation: Observation | null;
}

export default function ObservationDetails({
  observation,
}: ObservationDetailsProps) {
  if (!observation) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center">
        <p className="text-gray-500 italic">
          Select an observation on the map to view details
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-full">
      <h2 className="text-lg font-bold text-gray-900 mb-2">
        {observation.species_guess}
      </h2>

      {observation.photos.length > 0 && (
        <div className="mb-4">
          <img
            src={observation.photos[0].url}
            alt={observation.species_guess}
            className="w-full rounded-lg object-cover max-h-64"
          />
        </div>
      )}

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Date Observed</h3>
          <p className="text-sm text-gray-900">{observation.observed_on}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700">Location</h3>
          <p className="text-sm text-gray-900">{observation.place_guess}</p>
          <p className="text-xs text-gray-500">
            Coordinates: {observation.location[0].toFixed(5)},{" "}
            {observation.location[1].toFixed(5)}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700">Observer</h3>
          <p className="text-sm text-gray-900">{observation.user.name}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700">Quality</h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              observation.quality_grade === "research"
                ? "bg-green-100 text-green-800"
                : observation.quality_grade === "needs_id"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {observation.quality_grade.replace("_", " ")}
          </span>
        </div>

        <div className="pt-2">
          <a
            href={observation.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View on iNaturalist
          </a>
        </div>
      </div>
    </div>
  );
}
