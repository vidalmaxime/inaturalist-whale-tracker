"use client";

import React from "react";
import { Observation } from "@/services/api";

interface ObservationsListProps {
  observations: Observation[];
  selectedObservation: Observation | null;
  onObservationSelect: (observation: Observation) => void;
  totalResults: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
}

export default function ObservationsList({
  observations,
  selectedObservation,
  onObservationSelect,
  totalResults,
  currentPage,
  onPageChange,
}: ObservationsListProps) {
  if (observations.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-500 text-center">No observations found</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalResults / 200); // Assuming 200 per page based on API

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium text-gray-900">
          {totalResults} Observations Found
        </h2>
      </div>
      <ul className="divide-y divide-gray-200 overflow-y-auto max-h-[500px]">
        {observations.map((observation) => (
          <li
            key={observation.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              selectedObservation?.id === observation.id ? "bg-blue-50" : ""
            }`}
            onClick={() => onObservationSelect(observation)}
          >
            <div className="flex items-start space-x-3">
              {observation.photos.length > 0 ? (
                <img
                  src={observation.photos[0].url}
                  alt={observation.species_guess}
                  className="h-12 w-12 rounded-md object-cover"
                />
              ) : (
                <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {observation.species_guess}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {observation.observed_on}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {observation.place_guess}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Simple pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
