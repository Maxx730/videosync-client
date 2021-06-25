import './App.css';
import socketClient from 'socket.io-client';
import {useEffect, useState} from 'react';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import Sidebar from './components/Sidebar';
import VideoPlayer from 'components/VideoPlayer';
import {Columns, Tabs, Section} from 'react-bulma-components';

const SERVER = process.env.NODE_ENV === 'development' ? 'localhost:4000' : 'https://videosync-ku38p.ondigitalocean.app';

function App() {
  const socket = socketClient(SERVER, {autoConnect: true});
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('users');

  const nickname = uniqueNamesGenerator({ dictionaries: [adjectives, animals], separator: '', style: 'capital', length: 2 });

  useEffect(() => {
    socket.emit('user_login', nickname);
    socket.on('users_updated', users => {
      setUsers(users);
    });
  }, []);

  return (
    <Columns>
      <Columns.Column paddingless={true} marginless={true} size={8}>
        <VideoPlayer/>
      </Columns.Column>
      <Columns.Column paddingless={true} marginless={true} size={4}>
        <Section pl={1}>
          <Sidebar onChangeTab={tab => {
            setTab(tab);
          }} tab={tab} users={users}/>
        </Section>
      </Columns.Column>
    </Columns>
  );
}

export default App;
