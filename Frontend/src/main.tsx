import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PersistGate persistor={persistor}>
            <Provider store={store}>
                <App />
            </Provider>
        </PersistGate>
    </StrictMode>,
);
