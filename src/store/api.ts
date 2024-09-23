import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LocationDataResponse, WeatherData, WeatherResponse } from "./type";
import _ from 'lodash';
import { processWeatherData } from "../helpers/parseWeatherData";

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://api.open-meteo.com/v1/',
});
const REDUCER_PATH_API = 'rootApi'
export const Api = createApi({
    reducerPath: REDUCER_PATH_API,
    baseQuery: baseQuery,
    endpoints: (build) => ({
        getWeatherDetails: build.query<WeatherData, {latitude: number, longitude: number}>({
            query: (args) => {
              return {
                url: 'forecast',
                method: 'GET',
                params: {
                    latitude: args.latitude,
                    longitude: args.longitude,
                    current:'temperature_2m',
                    hourly:'temperature_2m,weather_code'
                },
              };
            },
            transformResponse: (response: WeatherResponse) => {
                return processWeatherData( response?.hourly?.time, response?.hourly?.temperature_2m,response?.hourly?.weather_code);
              },
          }),
        getLocationDetailsFromName: build.query<LocationDataResponse, {name: string, count: number}>({
            query: (args) => {
              return {
                url: 'https://geocoding-api.open-meteo.com/v1/search',
                method: 'GET',
                params: {
                    name: args.name,
                    count: args.count,
                    language: 'en',
                    format: 'json'

                },
              };
            },
          }),
    }),
  });

export const {
    useGetLocationDetailsFromNameQuery,
    useLazyGetLocationDetailsFromNameQuery,
    useGetWeatherDetailsQuery,
    useLazyGetWeatherDetailsQuery
} = Api