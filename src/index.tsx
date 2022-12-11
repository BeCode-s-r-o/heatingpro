// Internet Explorer 11 requires polyfills and partially supported by this project.
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
import "./i18n";
import "./styles/app-base.css";
import "./styles/app-components.css";
import "./styles/app-utilities.css";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import * as React from "react";

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);
root.render(<App />);
