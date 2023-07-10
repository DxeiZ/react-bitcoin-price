import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import axios from 'axios';
import App from './App';
import './index.css';

function todos(state = [], action) {
  switch (action.type) {
    case 'btc':
      return state.concat(action.data);
    default:
      return state;
  }
}

const store = createStore(todos);

axios.get('https://api.coincap.io/v2/assets')
  .then(response => {
    const assets = response.data.data;
    const btcData = assets.find(asset => asset.id === 'bitcoin');
    if (btcData) {
      const { id, symbol, name, priceUsd } = btcData;
      store.dispatch({ type: 'btc', data: { id, symbol, name, priceUsd } });
    }
  })
  .catch(error => {
    console.log(error);
  });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);

