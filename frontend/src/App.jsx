import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://final-project.local/api/test")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Error al connectar amb API"));
  }, []);

  return (
    <div>
      <h1>Prova Laravel + React</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
