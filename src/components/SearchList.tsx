import React from 'react';
import {dispatch, ResultsEntity, selectLocation} from '../store';
import {SerializedError} from '@reduxjs/toolkit';
import {FetchBaseQueryError} from '@reduxjs/toolkit/query';
import {ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import _ from 'lodash';
import {ListEmpty} from './ListEmpty';
import { ErrorView } from './ErrorView';

interface SearchListProps {
  results?: ResultsEntity[];
  isLoading: boolean;
  isError: boolean;
  error: SerializedError | FetchBaseQueryError;
  navigation: any;
}
export const SearchList: React.FC<SearchListProps> = ({
  error,
  isError,
  isLoading,
  results,
  navigation,
}) => {
  const onPress = (item: ResultsEntity) => {
    dispatch(
      selectLocation({
        locationData: {
          lat: item.latitude,
          lng: item.longitude,
          name: item.name,
        },
      }),
    );
    navigation.navigate('HomeScreen');
  };

  if (isError) {
    return (
      <ErrorView
      errorString={JSON.stringify(error)}
      />
    );
  }

  if (isLoading) {
    return <ActivityIndicator/>
  }

  if
  return (
    <FlatList
      data={results}
      ListEmptyComponent={<ListEmpty />}
      renderItem={({index, item}) => {
        return (
          <TouchableOpacity
            onPress={() => {
              onPress(item);
            }}
            style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#1F2933',
    padding: 20,
    borderRadius: 8,
    marginRight: 10,
    borderColor: '#37474F',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  name: {fontSize: 27, color: '#FFF', fontWeight: '800'},
});
