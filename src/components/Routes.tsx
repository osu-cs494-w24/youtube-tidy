import { ReactNode } from "react";
import { Outlet, NavLink } from "react-router-dom";

function Root({ children }: { children?: ReactNode }) {
  return (
    <>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Other pages here...</li>
        <li>Other pages here...</li>
        <li>Other pages here...</li>
        <NavLink to="/search">
          <li>List of Videos</li>
        </NavLink>
        <NavLink to="/search/123">
          <li>
            Just a random route parameter link. The route parameter for
            `/search/` will be an index page for the video itself.
          </li>
        </NavLink>
      </ul>

      <main>{children || <Outlet />}</main>
    </>
  );
}
export default Root;
