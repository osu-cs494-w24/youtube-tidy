import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import { Provider } from "react-redux";
import store from "./redux/store";

import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Container>
      <Provider store={store}>
        <App />
      </Provider>
    </Container>
  </React.StrictMode>
);
