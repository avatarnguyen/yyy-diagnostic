import Chatbot from './Chatbot/Chatbot'
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Diagnostic Tool</h1>
      </header>
        
        <Chatbot />
    </div>
  );
}

export default App;
