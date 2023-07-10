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

const store = createStore(dataReducer);

async function fetchData() {
  const response = await axios.get('https://api.coincap.io/v2/assets');
  const assets = response.data.data;
  const btcData = assets.find(asset => asset.id === 'bitcoin');
  if (btcData) {
    const { id, symbol, name, priceUsd } = btcData;
    store.dispatch({ type: 'UPDATE_DATA', newData: { id, symbol, name, priceUsd } });
  }
  return btcData;
}

function App({ todos }) {
  const handleUpdateData = async () => {
    try {
      await fetchData().then(response => {
        document.getElementById('updater').innerHTML = `<span class="loading loading-spinner"></span>`
        const buttonElement = document.getElementById('updater');
        buttonElement.disabled = true;
        setInterval(() => {
          document.getElementById('updater').innerHTML = `Veriyi Güncelle`
          buttonElement.disabled = false;
        }, 3000);
        document.getElementById('symbol').textContent = response.symbol;
        document.getElementById('name').textContent = response.name;
        document.getElementById('priceUsd').textContent = `${parseFloat(response.priceUsd).toFixed(1)}$`;
      });
    } catch (error) {
      console.log(error);
    }
  };

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
            
          <span className="indicator-item indicator-bottom indicator-center badge bg-transparent" key={Math.floor(Math.random() * 1000)}>
            <button id='updater' className="mt-5 btn btn-primary btn-wide" onClick={handleUpdateData}>Veriyi Güncelle</button>
          </span>
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
