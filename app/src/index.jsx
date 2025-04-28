import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import MainPage from "./components/main-page/main-page.jsx";
import { AuthProvider } from "./context/AuthContext";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

class Maie extends React.Component {
  render() {
    return (
      <React.Fragment>
        <AuthProvider>
          <MainPage />
        </AuthProvider>
      </React.Fragment>
    );
  }
}

const rootElement = document.getElementById("app");
const root = ReactDOM.createRoot(rootElement);
root.render(<Maie />);
