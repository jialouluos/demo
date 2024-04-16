import React from 'react';
import ReactDOM from 'react-dom/client';
import MyRouter from './router/index.tsx';
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<MyRouter />
	</React.StrictMode>
);
