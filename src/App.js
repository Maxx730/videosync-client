import './App.css';
import socketClient from 'socket.io-client';

const SERVER = process.env.NODE_ENV === 'development' ? 'localhost:4000' : 'https://videosync-core-kzoyq.ondigitalocean.app';

function App() {
  const socket = socketClient(SERVER);
  return (
    <div className="App">
dafdasf
    </div>
  );
}

export default App;
