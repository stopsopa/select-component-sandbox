
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import CompositeExample from "./pages/CompositeExample";

function Home() {
  return (
    <>
      <section id="center">
        <div>
          <ul>
            <li>
              <Link to="/composite-example" data-testid="composite-example" className="gcp-css">
                CompositeExample
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/composite-example" element={<CompositeExample />} />
      {/* <Route path="/composite-select-demo-attr" element={<CompositeSelectDemoAttr />} />
      <Route path="/options-section-demo" element={<OptionsSectionDemo />} />
      <Route path="/selected-section-demo" element={<SelectedSectionDemo />} />
      <Route path="/url-serialiser" element={<UrlSerialiser />} />
      <Route path="/url-serialiser-mod" element={<ModURLSearchParamsComponent />} /> */}
    </Routes>
  );
}

export default App;
