import React from 'react';
import {RootStackNavProps} from '../navigation/stack-param-list';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getLocationData,
  ParsedWeatherDataItem,
  useAppSelector,
  useLazyGetWeatherDetailsQuery,
} from '../store';
import _ from 'lodash';
import {SafeAreaView} from 'react-native-safe-area-context';
import moment from 'moment';
import {HomeHeader, WeatherForWeekList} from '../components';

export const HomeScreen: React.FC<RootStackNavProps<'HomeScreen'>> = ({
  navigation,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <HomeHeader
          onPress={() => {
            navigation.navigate('SearchScreen');
          }}
        />

        <WeatherForWeekList />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 10,
    paddingHorizontal: 15,
  },
});
