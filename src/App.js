import React from 'react';
import { connect } from 'react-redux';
import { createStore } from 'redux';
import axios from 'axios';
import './App.css'

function dataReducer(state = null, action) {
  switch (action.type) {
    case 'UPDATE_DATA':
      return action.newData;
    default:
      return state;
  }
}

const updateDataMiddleware = store => next => action => {
  if (action.type === 'START_UPDATE_DATA') {
    setInterval(() => {
      fetchData()
        .then(newData => {
          const { id, symbol, name, priceUsd } = newData;
          store.dispatch({ type: 'START_UPDATE_DATA', newData: { id, symbol, name, priceUsd } });
        })
        .catch(error => {
          console.log(error);
        });
    }, 5000);
  }
  
  return next(action);
};

const store = createStore(dataReducer);

async function fetchData() {
  const response = await axios.get('https://api.coincap.io/v2/assets');
  const assets = response.data.data;
  const btcData = assets.find(asset => asset.id === 'bitcoin');
  if (btcData) {
    const { id, symbol, name, priceUsd } = btcData;
    store.dispatch({ type: 'START_UPDATE_DATA', newData: { id, symbol, name, priceUsd } });
  }
  return btcData;
}

updateDataMiddleware()

function updateDataPeriodically() {
  setInterval(async () => {
    try {
      await fetchData().then(response => {
        document.getElementById('symbol').textContent = response.symbol;
        document.getElementById('name').textContent = response.name;
        document.getElementById('priceUsd').textContent = `${parseFloat(response.priceUsd).toFixed(1)}$`;
      });
    } catch (error) {
      console.log(error);
    }
  }, 1000); // Örnekte her 1 dakikada bir güncelleme yapılıyor
}

updateDataPeriodically(); 

function App({ todos }) {
  return (
    <div className="App">
      {todos && todos.map((todo) => (
        <div className="indicator" key={Math.floor(Math.random() * 1000)}>
          <div className="stats shadow-xl" key={Math.floor(Math.random() * 1000)}>
          <div className="stat" key={Math.floor(Math.random() * 1000)}>
            <div className="stat-title">Sembolü:</div>
            <div className="stat-value text-primary"><span id='symbol'>{todo.symbol}</span></div>
            <div className="stat-desc">Bitcoin, genel olarak kullanılma şekliyle<br/>sembolü ile temsil edilir.</div>
          </div>

          <div className="stat" key={Math.floor(Math.random() * 1000)}>
            <div className="stat-title">Isim:</div>
            <div className="stat-value text-primary"><span id='name'>{todo.name}</span></div>
            <div className="stat-desc">Bitcoin'in asıl ismi "Bitcoin" olarak bilinir.</div>
          </div>

          <div className="stat" key={Math.floor(Math.random() * 1000)}>
            <div className="stat-title">Fiyat (USD):</div>
            <div className="stat-value text-primary"><span id='priceUsd'>{parseFloat(todo.priceUsd).toFixed(1)}$</span></div>
            <div className="stat-desc">Bitcoin'in, dolar karşısındaki para birimi.</div>
          </div>
          </div>
      </div>
      ))}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    todos: state,
  };
};

export default connect(mapStateToProps)(App);
