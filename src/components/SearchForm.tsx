"use client";

import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datepicker.css";
import { subDays } from "date-fns";
import { getSpeciesSuggestions, SpeciesSuggestion } from "@/services/api";

interface SearchFormProps {
  onSearch: (
    taxonName: string,
    startDate: Date | null,
    endDate: Date | null
  ) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  // Default to "Humpback Whale" and last 30 days
  const [taxonName, setTaxonName] = useState<string>("Humpback Whale");
  const [startDate, setStartDate] = useState<Date | null>(
    subDays(new Date(), 30)
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [suggestions, setSuggestions] = useState<SpeciesSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] =
    useState<boolean>(false);

  const suggestionBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionBoxRef.current &&
        !suggestionBoxRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch suggestions when taxon name changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (taxonName.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);
      try {
        const results = await getSpeciesSuggestions(taxonName);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [taxonName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(taxonName, startDate, endDate);
  };

  const handleSuggestionClick = (suggestion: SpeciesSuggestion) => {
    setTaxonName(suggestion.preferred_common_name || suggestion.name);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="species"
            className="block text-sm font-medium text-gray-900"
          >
            Species
          </label>
          <div className="relative">
            <input
              type="text"
              id="species"
              value={taxonName}
              onChange={(e) => setTaxonName(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Enter species name"
              required
              autoComplete="off"
            />
            {isLoadingSuggestions && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            )}
            {showSuggestions && (
              <div
                ref={suggestionBoxRef}
                className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                <ul className="py-1">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-black"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="font-medium">
                        {suggestion.preferred_common_name || suggestion.name}
                      </span>
                      {suggestion.preferred_common_name && suggestion.name && (
                        <span className="ml-2 text-gray-500 text-sm italic">
                          ({suggestion.name})
                        </span>
                      )}
                      {suggestion.rank && (
                        <span className="ml-2 text-gray-500 text-xs">
                          {suggestion.rank}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-900"
            >
              Start Date
            </label>
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={new Date()}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-900"
            >
              End Date
            </label>
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate as Date | undefined}
              maxDate={new Date()}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
    </div>
  );
}
