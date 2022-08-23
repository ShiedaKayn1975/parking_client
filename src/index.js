import React from "react";
import ReactDOM from "react-dom";
import App from './App'
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
import { PublicClientApplication } from "@azure/msal-browser";

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById("index"));