import { useState } from "react";
import logo from "./assets/EMDB_Logo_1.png";
import Home from "./UserPages/home.tsx";
import Movies from "./UserPages/movies.tsx";
import Actors from "./UserPages/actors.tsx";
import Directors from "./UserPages/directors.tsx";
import Co_Star from "./TechnicalPages/Co_Star.tsx";
import "./my_style.css";
import Prestige_Network from "./TechnicalPages/prest_net.tsx";
//import "./App.css";

// from the legacy version of app.tsx
// kept around for for safety, just in case, will be deleted in the future if there are no objections
// interface Actor {
//   NodeID: number
//   ActorID: string
//   Name: string
//   DateOfBirth: string
//   Nationality: string
// }

// navgation states
const navLinks = [
  "home",
  "movies",
  "actors",
  "directors",
  "co-stars",
  "prestige",
];

// note to self add legal page navigation in the future

export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    if (page === "home") return <Home />;
    if (page === "movies") return <Movies />;
    if (page === "actors") return <Actors />;
    if (page === "directors") return <Directors />;
    if (page === "co-stars") return <Co_Star />;
    if (page === "prestige") return <Prestige_Network />;
  };

  return (
    <div className="emdb-home">
      {/* Navbar - stays on every page */}
      <header className="emdb-header">
        {/* <div
          className="emdb-logo"
          onClick={() => setPage("home")}
          style={{ cursor: "pointer" }}
        >
          EMDB
        </div> */}

        <img
          src={logo}
          alt="EMDB logo"
          className="emdb-logo"
          onClick={() => setPage("home")}
          style={{ cursor: "pointer" }}
        />

        <nav className="emdb-nav">
          {navLinks.map((link) => (
            <button
              key={link}
              className={`nav-link ${page === link ? "active" : ""}`}
              onClick={() => setPage(link)}
            >
              {link.charAt(0).toUpperCase() + link.slice(1)}
            </button>
          ))}
        </nav>
      </header>

      {/* Page content */}
      <main>{renderPage()}</main>

      {/* Note to self, update to include legal pages in footer, including (but potentially not limited too
    - Cookie Policy
    - Privacy Policy
    - Terms and Conditions
 ) */}

      {/* Page Footer - stays on every page*/}
      <footer className="emdb-footer">
        <p>© 2026 EMDB — Entertainment Media Database</p>
      </footer>
    </div>
  );

  // const [actors, setActors] = useState<Actor[]>([])
  // const fetchActors = () => {
  //   fetch('/api/actors/')
  //     .then(res => res.json())
  //     .then(data => setActors(data))
  // }
  // return (
  //   <>
  //     <h1>EMDB</h1>
  //     <button onClick={fetchActors}>Load Actors</button>
  //     <ul>
  //       {actors.map(actor => (
  //         <li key={actor.NodeID}>
  //           {actor.Name} — {actor.Nationality}
  //         </li>
  //       ))}
  //     </ul>
  //   </>
  // )
}

// export default App
