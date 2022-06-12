import "./App.css";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Install from "./components/Install";

function App() {
  const [accounts, setAccounts] = useState([]);
  if (window.ethereum) {
    return (
      <div>
        <Navbar accounts={accounts} setAccounts={setAccounts} />
        <Main accounts={accounts} setAccounts={setAccounts} />;
      </div>
    );
  } else {
    return <Install />;
  }
}

export default App;
