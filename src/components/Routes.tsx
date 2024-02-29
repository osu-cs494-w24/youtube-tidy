import { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

function Root({ children }: { children?: ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children || <Outlet />}</main>
    </>
  );
}
export default Root;
