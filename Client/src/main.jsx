import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { HeroUIProvider } from "@heroui/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store, persistor } from './store/index.js';
import { PersistGate } from 'redux-persist/integration/react';
import { WalletProvider } from './components/Common_Features/WalletProvider.jsx'
import { setupOneSignal } from './OneSignalSetup/OneSignalProvider.jsx'
import './index.css'
import App from './App.jsx'

async function initializeApp() {
  await setupOneSignal();
  createRoot(document.getElementById('root')).render(

    <StrictMode>

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <HeroUIProvider>
              <WalletProvider>
                <App />
              </WalletProvider>
              <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                theme="dark"
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </HeroUIProvider>
          </BrowserRouter>
        </PersistGate>
      </Provider>

    </StrictMode>
  )
}
initializeApp();