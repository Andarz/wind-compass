
import { GoogleGenAI, Type } from "@google/genai";
import { type WeatherData } from '../types';

export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  if (!import.meta.env.VITE_API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

  const prompt = `Generate realistic weather data for the location with latitude ${lat} and longitude ${lon}. I only need wind speed in meters/second and wind direction in degrees (from 0 to 359).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wind: {
              type: Type.OBJECT,
              properties: {
                speed: {
                  type: Type.NUMBER,
                  description: "Wind speed in meters/second, with one decimal place."
                },
                deg: {
                  type: Type.INTEGER,
                  description: "Wind direction in degrees from 0 to 359."
                }
              },
              required: ["speed", "deg"]
            }
          },
          required: ["wind"]
        },
      },
    });

    const jsonString = response.text?.trim() ?? "";

    const data = JSON.parse(jsonString);
    
    // Basic validation
    if (data && data.wind && typeof data.wind.speed === 'number' && typeof data.wind.deg === 'number') {
      return data as WeatherData;
    } else {
      throw new Error("Invalid data structure received from API");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Could not fetch weather data. Please try again later.");
  }
};
