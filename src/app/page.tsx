"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import SearchForm from "@/components/SearchForm";
import ObservationsList from "@/components/ObservationsList";
import ObservationDetails from "@/components/ObservationDetails";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  searchObservations,
  ObservationSearchParams,
  Observation,
} from "@/services/api";

// Dynamically import the map component to avoid SSR issues with Leaflet
const ObservationMap = dynamic(() => import("@/components/ObservationMap"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function Home() {
  const [searchParams, setSearchParams] = useState<ObservationSearchParams>({
    taxon_name: "Humpback Whale",
    per_page: 200,
    page: 1,
  });
  const [observations, setObservations] = useState<Observation[]>([]);
  const [selectedObservation, setSelectedObservation] =
    useState<Observation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch observations on initial load and when search params change
  useEffect(() => {
    const fetchObservations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await searchObservations(searchParams);
        setObservations(response.results);
        setTotalResults(response.total_results);

        // Select the first observation by default if available
        if (response.results.length > 0 && !selectedObservation) {
          setSelectedObservation(response.results[0]);
        }
      } catch (error) {
        console.error("Error fetching observations:", error);
        setError("Failed to fetch observations. Please try again.");
        setObservations([]);
        setTotalResults(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchObservations();
  }, [searchParams]);

  // Handle search form submission
  const handleSearch = (
    taxonName: string,
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setSearchParams({
      taxon_name: taxonName,
      dateFrom: startDate,
      dateTo: endDate,
      per_page: 200,
      page: 1,
    });
    setSelectedObservation(null);
  };

  // Handle page change for pagination
  const handlePageChange = (newPage: number) => {
    setSearchParams({
      ...searchParams,
      page: newPage,
    });
    setSelectedObservation(null);
    // Scroll to top on page change
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            iNaturalist Whale Tracker
          </h1>
          <p className="text-blue-100">
            Explore recent whale sightings around the world
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with search and list */}
          <div className="lg:col-span-1 space-y-6">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />

            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-md text-red-800">
                {error}
              </div>
            ) : (
              <ObservationsList
                observations={observations}
                selectedObservation={selectedObservation}
                onObservationSelect={setSelectedObservation}
                totalResults={totalResults}
                currentPage={searchParams.page || 1}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          {/* Main content with map and details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Map */}
            <div className="bg-white rounded-lg shadow-md h-[500px]">
              {!isLoading && observations.length > 0 ? (
                <ObservationMap
                  observations={observations}
                  selectedObservation={selectedObservation}
                  onMarkerClick={setSelectedObservation}
                />
              ) : isLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">
                    No observations to display on the map
                  </p>
                </div>
              )}
            </div>

            {/* Observation details */}
            <ObservationDetails observation={selectedObservation} />
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>
            Data provided by{" "}
            <a
              href="https://www.inaturalist.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              iNaturalist
            </a>
          </p>
          <p className="mt-1 text-gray-400">
            Built with Next.js, Tailwind CSS, and Leaflet
          </p>
        </div>
      </footer>
    </div>
  );
}
