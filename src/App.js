import "./App.css";
import ChessBoard from "./Components/ChessBoard";

function App() {
  return (
    <div className="App">
      <LeftPanel />
      <ChessBoard
        FEN={"r1bqk1nr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 5"}
      ></ChessBoard>
      <div>chessboard</div>
    </div>
  );
}

export default App;
