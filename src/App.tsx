import "./App.css";

function App() {
  return (
    <div className="container">
      <h1 className="title">ChatLLM Enter Modifier</h1>
      <div className="shortcut-card">
        <h2 className="shortcut-title">Keyboard Shortcuts</h2>

        <div className="shortcut-list">
          <div className="shortcut-item">
            <kbd>Enter</kbd>
            <span className="arrow">→</span>
            <div className="key-combo">
              <kbd>Shift</kbd>
              <span className="plus">+</span>
              <kbd>Enter</kbd>
            </div>
            <span className="description">(New line)</span>
          </div>

          <div className="shortcut-item">
            <div className="key-combo">
              <kbd>CMD</kbd>
              <span className="plus">+</span>
              <kbd>Enter</kbd>
            </div>
            <span className="arrow">→</span>
            <kbd>Enter</kbd>
            <span className="description">(Submit)</span>
          </div>
        </div>
      </div>

      <div className="version">Version 1.0</div>
    </div>
  );
}

export default App;
