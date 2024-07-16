import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from "react-router-dom"
import StoreContextprovider from './context/StoreContext.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <BrowserRouter>
    <StoreContextprovider>

      <ChakraProvider>
        <App />
      </ChakraProvider>

    </StoreContextprovider>
  </BrowserRouter>
);


