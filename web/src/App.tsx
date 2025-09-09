import "./App.css";
import { ChatInput } from "./components";

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>Heybobo - Chat Module</h1>
      </header>

      <main className="chat" role="list" aria-label="chat history"></main>

      <div className="inputbar">
        <ChatInput />
        <div className="input-controls">
          <span>
            Press <kbd>Enter</kbd> to send • <kbd>Shift+Enter</kbd> for newline
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
