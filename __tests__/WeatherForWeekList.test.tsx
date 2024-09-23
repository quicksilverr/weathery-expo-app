import React, {ReactNode} from 'react';
import {
  render,
  screen,
  fireEvent,
  renderHook,
} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureMockStore, {MockStoreCreator} from 'redux-mock-store';
import thunk from 'redux-thunk';
import {WeatherForWeekList} from '../src/components';
import {RootState, reduxStore} from '../src/store';
import {useLazyGetWeatherDetailsQuery} from '../src/store/api';
import {getLocationData} from '../src/store';
import {AnyAction, ThunkMiddleware} from '@reduxjs/toolkit';

const mockStore: MockStoreCreator<
  RootState,
  ThunkMiddleware<RootState, AnyAction>
> = configureMockStore([thunk]);

jest.mock('../src/store/api');

jest.mock('../src/store', () => ({
  useAppSelector: jest.fn(),
  useLazyGetWeatherDetailsQuery: jest.fn(),
  getLocationData: jest.fn(),
}));

jest.mock('../src/helpers/getWeatherImage', () =>
  jest.fn(() => ({
    description: 'Sunny',
    image: 'sunny.png',
  })),
);

function Wrapper(props: {children: ReactNode}) {
  return <Provider store={reduxStore}>{props.children}</Provider>;
}

describe('WeatherForWeekList Component', () => {
  let store;

  beforeEach(() => {
    // store = mockStore({
    //   rootApi: {},
    //   rootSlice: {
    //     locationData: {
    //       name: 'Pune',
    //       lat: 18.51957,
    //       lng: 73.85535,
    //     },
    //   },
    // });
    renderHook(() => useLazyGetWeatherDetailsQuery(), {wrapper: Wrapper});
    // useLazyGetWeatherDetailsQuery.mockReturnValue([
    //   jest.fn(),
    //   {data: null, isFetching: false, isError: false},
    // ]);
    getLocationData.mockReturnValueOnce({
      name: 'Pune',
      lat: 18.51957,
      lng: 73.85535,
    });
  });

  test('shows loading indicator when data is fetching', () => {
    // useLazyGetWeatherDetailsQuery.mockReturnValue([
    //   jest.fn(),
    //   {isFetching: true},
    // ]);
    const {result} = renderHook(() => useLazyGetWeatherDetailsQuery(), {
      wrapper: Wrapper,
    });

    //   result.current[0]

    const {getByTestId} = render(
      <Provider store={reduxStore}>
        <WeatherForWeekList />
      </Provider>,
    );

    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  test('renders error view when there is an error fetching weather data', () => {
    useLazyGetWeatherDetailsQuery.mockReturnValue([
      jest.fn(),
      {isError: true, error: 'Something went wrong'},
    ]);

    const {getByText} = render(
      <Provider store={reduxStore}>
        <WeatherForWeekList />
      </Provider>,
    );

    expect(
      getByText(
        "It's not you, it's us. There's seems to be an error on our end.",
      ),
    ).toBeTruthy();
  });

  test('renders ListEmpty component when there is no data', () => {
    useLazyGetWeatherDetailsQuery.mockReturnValue([
      jest.fn(),
      {data: [], isFetching: false},
    ]);

    const {getByText} = render(
      <Provider store={reduxStore}>
        <WeatherForWeekList />
      </Provider>,
    );

    expect(getByText('Sorry, No results found.')).toBeTruthy();
  });

  test('renders todays weather correctly after fetching data', () => {
    const weatherData = {
      currentDate: {
        avgTemp: 25,
        mostFrequentWeatherCode: {description: 'Sunny', image: 'sunny.png'},
      },
      weekDates: [],
    };

    useLazyGetWeatherDetailsQuery.mockReturnValue([
      jest.fn(),
      {data: weatherData, isFetching: false},
    ]);

    const {getByText, getByAltText} = render(
      <Provider store={reduxStore}>
        <WeatherForWeekList />
      </Provider>,
    );

    expect(getByText("Today's weather in Pune")).toBeTruthy();
    expect(getByText('Sunny')).toBeTruthy();
    expect(getByText('25°C')).toBeTruthy();
  });

  test('renders weather data for the week in the FlatList', () => {
    const weatherData = {
      currentDate: {
        avgTemp: 25,
        mostFrequentWeatherCode: {description: 'Sunny', image: 'sunny.png'},
      },
      weekDates: [
        {
          date: '2024-09-21',
          avgTemp: 22,
          mostFrequentWeatherCode: {description: 'Cloudy', image: 'cloudy.png'},
        },
        {
          date: '2024-09-22',
          avgTemp: 20,
          mostFrequentWeatherCode: {description: 'Rainy', image: 'rainy.png'},
        },
      ],
    };

    useLazyGetWeatherDetailsQuery.mockReturnValue([
      jest.fn(),
      {data: weatherData, isFetching: false},
    ]);

    const {getByText} = render(
      <Provider store={reduxStore}>
        <WeatherForWeekList />
      </Provider>,
    );

    expect(getByText('Cloudy')).toBeTruthy();
    expect(getByText('Rainy')).toBeTruthy();
  });
});
