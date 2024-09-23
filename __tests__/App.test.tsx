// import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {reduxStore} from '../src/store';
import {Text} from 'react-native';

// Mock the RootNavigator
jest.mock('../src/navigation', () => {
  return {
    RootNavigator: jest.fn(() => 'Mocked RootNavigator'), // Mocking the navigation
  };
});

// Test App Component
describe('App Component', () => {
  test('renders the Provider and RootNavigator', () => {
    const App = require('../App').default; // Dynamically require the App component to avoid hoisting issues

    // Render the App component wrapped in Provider
    const {getByText} = render(
      <Provider store={reduxStore}>
        <App />
      </Provider>,
    );

    // Check if the mocked RootNavigator is rendered
    expect(getByText('Mocked RootNavigator')).toBeTruthy();
  });
});
