import axios from "axios";
import { format, subDays } from "date-fns";

const API_BASE_URL = "https://api.inaturalist.org/v1";

// Interface for observation search parameters
export interface ObservationSearchParams {
  taxon_name?: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  per_page?: number;
  page?: number;
}

// Interface for observation result
export interface Observation {
  id: number;
  species_guess: string;
  observed_on: string;
  location: [number, number]; // [latitude, longitude]
  place_guess: string;
  user: {
    login: string;
    name: string;
  };
  photos: Array<{
    url: string;
  }>;
  uri: string;
  quality_grade: string;
}

// Interface for species suggestion
export interface SpeciesSuggestion {
  id: number;
  name: string;
  matched_term?: string;
  preferred_common_name?: string;
  rank?: string;
  iconic_taxon_name?: string;
}

// Interface for API response
export interface ObservationResponse {
  total_results: number;
  page: number;
  per_page: number;
  results: Observation[];
}

// Function to get species suggestions for autocomplete
export const getSpeciesSuggestions = async (
  query: string
): Promise<SpeciesSuggestion[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/taxa/autocomplete`, {
      params: {
        q: query,
        per_page: 10, // Limit to 10 suggestions
        order_by: "default",
      },
    });

    return response.data.results.map((result: any) => ({
      id: result.id,
      name: result.name,
      matched_term: result.matched_term,
      preferred_common_name: result.preferred_common_name,
      rank: result.rank,
      iconic_taxon_name: result.iconic_taxon_name,
    }));
  } catch (error) {
    console.error("Error fetching species suggestions:", error);
    return [];
  }
};

export const searchObservations = async (
  params: ObservationSearchParams
): Promise<ObservationResponse> => {
  const { taxon_name, dateFrom, dateTo, per_page = 200, page = 1 } = params;

  // Format dates for the API
  const d1 = dateFrom
    ? format(dateFrom, "yyyy-MM-dd")
    : format(subDays(new Date(), 30), "yyyy-MM-dd");
  const d2 = dateTo
    ? format(dateTo, "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd");

  try {
    const response = await axios.get(`${API_BASE_URL}/observations`, {
      params: {
        taxon_name,
        d1,
        d2,
        per_page,
        page,
        order_by: "observed_on",
        order: "desc",
        return_format: "json",
      },
    });

    // Transform the API response to match our interface
    const observations: Observation[] = response.data.results.map(
      (obs: any) => ({
        id: obs.id,
        species_guess: obs.species_guess,
        observed_on: obs.observed_on_string,
        location: [
          obs.geojson?.coordinates[1] || 0,
          obs.geojson?.coordinates[0] || 0,
        ],
        place_guess: obs.place_guess || "Unknown location",
        user: {
          login: obs.user.login,
          name: obs.user.name || obs.user.login,
        },
        photos:
          obs.photos?.map((photo: any) => ({
            url: photo.url.replace("square", "medium"),
          })) || [],
        uri: obs.uri,
        quality_grade: obs.quality_grade,
      })
    );

    return {
      total_results: response.data.total_results,
      page: response.data.page,
      per_page: response.data.per_page,
      results: observations,
    };
  } catch (error) {
    console.error("Error fetching observations:", error);
    throw error;
  }
};
