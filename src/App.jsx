import { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutPage from "./components/layout";
import Maksvell from "./pages/Maksvell";
import { Chart as ChartJS, Tooltip, Legend,   CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title, } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutPage />}>
            <Route path="maksvell" element={<Maksvell />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
