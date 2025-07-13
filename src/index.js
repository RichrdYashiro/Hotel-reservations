import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { store } from './store';
import { Hotel } from './Hotel';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<Provider store={store}>
				<Hotel />
		</Provider>
	</BrowserRouter>
);
