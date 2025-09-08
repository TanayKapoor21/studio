"use server";

import {
  environmentalMonitoringInsights,
  type EnvironmentalMonitoringInsightsInput,
} from "@/ai/flows/environmental-monitoring-insights";
import {
  getPricePredictionAndRecommendations,
  type PricePredictionAndRecommendationsInput,
} from "@/ai/flows/price-prediction-and-recommendations";
import {
  getFertilizerRecommendation,
  type FertilizerRecommendationInput,
} from "@/ai/flows/smart-fertilizer-recommendations";
import {
  weatherBasedCropSuggestions,
  type WeatherBasedCropSuggestionsInput,
} from "@/ai/flows/weather-based-crop-suggestions";

export async function runFertilizerRecommendation(
  input: FertilizerRecommendationInput
) {
  try {
    const result = await getFertilizerRecommendation(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to get fertilizer recommendation." };
  }
}

export async function runPricePrediction(
  input: PricePredictionAndRecommendationsInput
) {
  try {
    const result = await getPricePredictionAndRecommendations(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to get price prediction." };
  }
}

export async function runEnvironmentalMonitoring(
  input: EnvironmentalMonitoringInsightsInput
) {
  try {
    const result = await environmentalMonitoringInsights(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to get environmental insights." };
  }
}

export async function runCropSuggestion(
  input: WeatherBasedCropSuggestionsInput
) {
  try {
    const result = await weatherBasedCropSuggestions(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to get crop suggestions." };
  }
}
