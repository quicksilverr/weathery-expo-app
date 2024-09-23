import React from 'react';
import {RootStackNavProps} from '../navigation/stack-param-list';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import debounce from 'lodash/debounce';
import {
  dispatch,
  selectLocation,
  useLazyGetLocationDetailsFromNameQuery,
} from '../store';
import _ from 'lodash';

export const SearchScreen: React.FC<RootStackNavProps<'SearchScreen'>> = ({
  navigation,
}) => {
  const [fetchLocations, response] = useLazyGetLocationDetailsFromNameQuery();
  const onSearch = (query: string) => {
    fetchLocations({
      count: 20,
      name: query,
    });
  };
  const onQueryDebouce = React.useCallback(debounce(onSearch, 500), []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#121212',
        paddingTop: 10,
        paddingHorizontal: 15,
      }}>
      <TextInput
        placeholder="Search location..."
        placeholderTextColor={'#FFF'}
        onChangeText={onQueryDebouce}
        style={{
          backgroundColor: '#1E1E1E',
          color: '#FFFFFF',
          padding: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#37474F',
          marginBottom: 20,
        }}
      />
      {response.isFetching && _.isEmpty(response.data?.results) ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={response.data?.results}
          renderItem={({index, item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
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
                }}
                style={{
                  backgroundColor: '#1F2933',
                  padding: 20,
                  borderRadius: 8,
                  marginRight: 10,
                  borderColor: '#37474F',
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 15,
                }}>
                <Text style={{fontSize: 27, color: '#FFF', fontWeight: '800'}}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};
