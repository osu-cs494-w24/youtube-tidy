import { css } from "@emotion/react";

function Theme() {
  const GlobalStyles = css`
    @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
    body {
      font-family: "Roboto", sans-serif;
      margin: 0;
      padding: 0;
    }
    button {
      padding: 1rem;
      margin-left: 0rem;
      border: none;
      border-radius: 15px;
      background-color: rgba(241, 73, 81, 0.3);
      font-size: 1.1rem;
      margin-left: 0.4rem;
      cursor: pointer;
    }
  `;
  return GlobalStyles;
}

export default Theme;
