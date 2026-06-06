export interface Place {
  id?: string;
  place_id: string;
  name: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  rating: number | null;
  review_count: number | null;
  latitude: number | null;
  longitude: number | null;
  category: string | null;
  search_keyword: string | null;
  search_location: string | null;
  created_at?: string;
}

export interface ExtractionRequest {
  keyword: string;
  locationName: string;
  radiusMeters: number;
}

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export interface PlaceResult {
  place_id: string;
  name: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  rating: number | null;
  review_count: number | null;
  latitude: number | null;
  longitude: number | null;
  category: string | null;
}
