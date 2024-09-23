import React from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import {
  getLocationData,
  ParsedWeatherDataItem,
  useAppSelector,
  useLazyGetWeatherDetailsQuery,
} from '../store';
import {WeatherForWeekListItem} from './WeatherForWeekListItem';
import _ from 'lodash';
import {ListEmpty} from './ListEmpty';
import {ErrorView} from './ErrorView';
import {TodaysWeather} from './TodaysWeather';
import moment from 'moment';
import getWeatherImage from '../helpers/getWeatherImage';

export const WeatherForWeekList: React.FC = () => {
  const locationData = useAppSelector(getLocationData);
  const [weatherData, setWeatherData] = React.useState<{
    currentDate: ParsedWeatherDataItem;
    weekDates: ParsedWeatherDataItem[];
  }>({
    currentDate: {
      avgTemp: 0,
      date: moment().format('DD-MM-YYYY'),
      mostFrequentWeatherCode: getWeatherImage('0'),
    },
    weekDates: [],
  });

  const [fetchWeatherDetails, response] = useLazyGetWeatherDetailsQuery();
  React.useEffect(() => {
    fetchWeatherDetails({
      latitude: locationData.lat,
      longitude: locationData.lng,
    });
  }, [locationData]);

  React.useEffect(() => {
    if (!_.isEmpty(response.data) && !_.isNil(response.data)) {
      const values = Object.entries(response.data).map(([key, value]) => {
        return {
          date: key,
          avgTemp: value.avgTemp,
          mostFrequentWeatherCode: value?.mostFrequentWeatherCode,
        };
      });
      setWeatherData({
        currentDate: values[0],
        weekDates: [...values],
      });
    }
  }, [response]);

  if (response.isError) {
    return <ErrorView errorString={JSON.stringify(response.error)} />;
  }

  if (response.isFetching) {
    return <ActivityIndicator />;
  }
  return (
    <View>
      <TodaysWeather
        locationName={locationData.name}
        weatherAvgTemp={weatherData.currentDate?.avgTemp}
        weatherDescription={
          weatherData.currentDate.mostFrequentWeatherCode?.description
        }
        weatherImage={weatherData.currentDate.mostFrequentWeatherCode?.image}
      />
      <FlatList
        data={weatherData.weekDates}
        ListEmptyComponent={<ListEmpty />}
        horizontal
        renderItem={({item}) => {
          return (
            <WeatherForWeekListItem
              key={JSON.stringify(item)}
              weatherItem={item}
            />
          );
        }}
      />
    </View>
  );
};
