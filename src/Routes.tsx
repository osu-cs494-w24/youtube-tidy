import { ReactNode } from "react";
import { Outlet, NavLink } from "react-router-dom";

function Root({ children }: { children?: ReactNode }) {
  return (
    <>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Other pages here...</li>
        <NavLink to="/search">
          <li>Search for Videos</li>
        </NavLink>
        <NavLink to="/search/123">
          <li>
            This is NOT a permanent link in the Nav. Just putting here so that
            way you all can see what an index page for a particular video could
            be like...
          </li>
        </NavLink>
      </ul>

      <main>{children || <Outlet />}</main>
    </>
  );
}
export default Root;
