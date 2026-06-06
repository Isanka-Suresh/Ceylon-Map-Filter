import axios from 'axios';
import { googleConfig } from './config';
import { GeocodingResult } from '../../types';

/**
 * Service to interact with the Google Geocoding API.
 * Designed for server-side use to protect API keys.
 */
export class GeocodingService {
  /**
   * Converts a location string into geographic coordinates.
   * 
   * @param locationName - The address or place name to geocode (e.g., "Colombo")
   * @returns A promise that resolves to lat, lng, and formatted address.
   * @throws Error if the API request fails or no results are found.
   */
  static async getCoordinates(locationName: string): Promise<GeocodingResult> {
    if (!locationName || locationName.trim() === '') {
      throw new Error('Location name must be provided');
    }

    try {
      const response = await axios.get(googleConfig.urls.geocoding, {
        params: {
          address: locationName,
          key: googleConfig.apiKey,
        },
      });

      const data = response.data;

      if (data.status !== 'OK' || !data.results || data.results.length === 0) {
        throw new Error(`Geocoding failed for "${locationName}": ${data.error_message || data.status}`);
      }

      // We take the first result as the most relevant match
      const result = data.results[0];

      return {
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
      };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Network error during geocoding API call: ${error.message}`);
      }
      // Re-throw custom logic errors from above
      throw error;
    }
  }
}
