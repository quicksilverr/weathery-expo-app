import {StyleSheet, Text, View} from 'react-native';
import {Provider} from 'react-redux';
import {reduxStore} from './src/store';
import {RootNavigator} from './src/navigation';

export default function App() {
  return (
    <Provider store={reduxStore}>
      <RootNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
