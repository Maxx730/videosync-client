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
  const [videos, setVideos] = useState([]);
  const [tab, setTab] = useState('users');
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(null);

  const nickname = uniqueNamesGenerator({ dictionaries: [adjectives, animals], separator: '', style: 'capital', length: 2 });

  useEffect(() => {
    socket.emit('user_login', nickname);
    
    socket.on('users_updated', users => {
      setUsers(users.users);
      setVideos(users.videos);
    });

    socket.on('start_player', value => {
      setPlaying(value);
    });

    socket.on('videos_updated', videos => {
      setVideos(videos);
    });

    socket.on('set_player_time', time => {
      setCurrentTime(time);
    });

    socket.on('set_video', video => {
      setCurrentVideo(video);
    });
  }, []);

  return (
    <Columns>
      <Columns.Column paddingless={true} marginless={true} size={8}>
        <VideoPlayer video={currentVideo} current={currentTime} playing={playing} onEnded={() => {
          socket.emit('next_video');
        }} onPlay={time => {
          socket.emit('playing', {playing: true, current: time});
        }} onPause={time => {
          socket.emit('playing', {playing: false, current: time});
        }} addVideo={video => {
          socket.emit('add_video', video);
        }}/>
      </Columns.Column>
      <Columns.Column paddingless={true} marginless={true} size={4}>
        <Section pl={1}>
          <Sidebar nickname={nickname} removeVideo={video => {
            socket.emit('remove_video', video);
          }} playlist={videos} onChangeTab={tab => {
            setTab(tab);
          }} tab={tab} users={users}/>
        </Section>
      </Columns.Column>
    </Columns>
  );
}

export default App;
