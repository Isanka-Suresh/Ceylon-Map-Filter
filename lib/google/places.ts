import axios from 'axios';
import { googleConfig } from './config';
import { PlaceResult } from '../../types';

export class PlacesService {
  /**
   * Searches for places using the Google Places API (New) Text Search endpoint.
   * This endpoint is highly flexible and accepts keywords while allowing location bias/restriction.
   *
   * @param keyword - The search term (e.g., "hospital", "resort")
   * @param latitude - The latitude of the search center
   * @param longitude - The longitude of the search center
   * @param radiusMeters - The radius to search within
   * @param pageToken - Optional token for pagination
   * @returns A promise that resolves to the list of places and an optional nextPageToken.
   */
  static async searchPlaces(
    keyword: string,
    latitude: number,
    longitude: number,
    radiusMeters: number,
    pageToken?: string
  ): Promise<{ places: PlaceResult[]; nextPageToken?: string }> {
    try {
      // Define the exact fields we want returned to save bandwidth and API costs
      const fieldMask = [
        'places.id',
        'places.displayName',
        'places.formattedAddress',
        'places.nationalPhoneNumber',
        'places.websiteUri',
        'places.rating',
        'places.userRatingCount',
        'places.location',
        'places.primaryType',
        'nextPageToken'
      ].join(',');

      // Construct the request body
      const requestBody: Record<string, any> = {
        textQuery: keyword,
        locationRestriction: {
          circle: {
            center: {
              latitude,
              longitude
            },
            radius: radiusMeters
          }
        }
      };

      // Add pagination token if it exists
      if (pageToken) {
        requestBody.pageToken = pageToken;
      }

      const response = await axios.post(
        googleConfig.urls.placesTextSearch,
        requestBody,
        {
          headers: {
            'X-Goog-Api-Key': googleConfig.apiKey,
            'X-Goog-FieldMask': fieldMask,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = response.data;
      
      // Map the Google API response to our unified PlaceResult interface
      const places: PlaceResult[] = (data.places || []).map((p: any) => ({
        place_id: p.id,
        name: p.displayName?.text || '',
        address: p.formattedAddress || null,
        phone: p.nationalPhoneNumber || null,
        website: p.websiteUri || null,
        rating: p.rating || null,
        review_count: p.userRatingCount || null,
        latitude: p.location?.latitude || null,
        longitude: p.location?.longitude || null,
        category: p.primaryType || keyword,
      }));

      return {
        places,
        nextPageToken: data.nextPageToken,
      };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Google Places API error: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }
}
