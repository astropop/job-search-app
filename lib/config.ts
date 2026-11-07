export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
export const GOOGLE_MAPS_AUTOCOMPLETE_ENDPOINT = "https://maps.googleapis.com/maps/api/place/autocomplete/json";
export const INDEED_API_BASE_URL = process.env.INDEED_API_BASE_URL ?? "";
export const SEEK_API_BASE_URL = process.env.SEEK_API_BASE_URL ?? "";

export const SEARCH_SOURCES = [
  { id: "all", label: "All sources" },
  { id: "indeed", label: "Indeed" },
  { id: "seek", label: "Seek" },
] as const;

if (typeof window === "undefined" && !GOOGLE_MAPS_API_KEY) {
  console.warn("[job-search-app] GOOGLE_MAPS_API_KEY is not configured; using map placeholder.");
}
