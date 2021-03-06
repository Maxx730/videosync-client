import './App.scss';
import socketClient from 'socket.io-client';
import {useEffect, useState} from 'react';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import Sidebar from './components/Sidebar';
import VideoPlayer from 'components/VideoPlayer';
import {Columns, Panel, Section} from 'react-bulma-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';
import { Button, IconButton, Icon, Notification, Loader } from 'rsuite';
import CustomNouns from './lib/CustomNouns';
import Credits from './components/Credits';
import ServerStatus from './components/ServerStatus';

const NOTIF_DUR = 1500;
const DEV_MODE = false;//process.env.NODE_ENV === 'development';
const SERVER = process.env.NODE_ENV !== 'development' ? 'https://videosync-jipwm.ondigitalocean.app' : 'localhost:4000';


function App() {
  const socket = socketClient(SERVER, {autoConnect: false, pingInterval: 100, pingTimeout: 2000000000, transports: ['websocket']});
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState('playlist');
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [moveAction, setMoveAction] = useState({
    action: null,
    complete: true
  });
  const [preferences, setPreferences] = useState(new Cookies());
  const [nickname, setNickname] = useState(preferences.get('video-sync-username') ? preferences.get('video-sync-username') : uniqueNamesGenerator({ 
    dictionaries: [adjectives, animals],
    separator: '',
    style: 'capital',
    length: 2 
  }));
  const [reactions, setReactions] = useState([]);
  const [banner, setBanner] = useState('Now With Chiken');
  const [serverStatus, setServerStatus] = useState('idle');
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    socket.connect();
    
    setInterval(() => {
      socket.emit('sync');
    }, 5000);

    window.addEventListener('focus', () => {
      socket.emit('play_pause', {playing: true});
    });

    //Join the room when the user loads the page.
    socket.emit('user_joined', nickname);

    socket.on('state_updated', payload => {
      switch(payload.action) {
        case 'joined':
          const user = payload.users[payload.users.length - 1].nickname;
          if (user !== nickname) {
            if (payload.action === 'joined')  {
              Notification['success']({
                title: 'User Joined',
                description: <><b>{user}</b> joined the room.</>,
                duration: NOTIF_DUR
              });
            }
          }
        break;
        case 'add_video':
          Notification['success']({
            title: `Video Added`,
            description: <><b>{payload.videos[0].snippet.title}</b></>,
            duration: NOTIF_DUR
          });
        break;
        case 'skip_video':
          Notification['warning']({
            title: `Video Skipped`,
            description: <><b>{payload.extra.user}</b> skipped the current video.</>,
            duration: NOTIF_DUR
          });
        break;
        case 'disconnect':
          Notification['warning']({
            title: `User Left`,
            description: <><b>{payload.user}</b> left the room.</>,
            duration: NOTIF_DUR
          });
        break;
        case 'name_update':
          Notification['success']({
            title: `Username Changed`,
            description: <><b>{payload.user}</b> changed their name.</>,
            duration: NOTIF_DUR
          });
        break;
        case 'video_exists':
          Notification['error']({
            title: `Video Exists`,
            description: <>Video already exists in Playlist!</>,
            duration: NOTIF_DUR
          });
        break;
        case 'change_player_time':
             setMoveAction({
                time: payload.currentTime,
                complete: false,
                onComplete: () => {
                  setMoveAction({complete: false});
                }
             })
             Notification['warning']({
                title: `Video Time Changed`,
                description: <><b>{payload.extra.user}</b> changed the time of the video.</>,
                duration: NOTIF_DUR
             });
        break;
        case 'banner':
          setBanner(payload.banner);
        break;
        default: 
        break;
      }

      setLastUpdate(payload.lastUpdate);
      setPlaying(payload.playing);
      setHistory(payload.history);
      setUsers(payload.users);
      setVideos(payload.videos);
      setCurrentVideo(payload.video);
      setServerStatus(payload.status);
    });
  }, []);

  return (
    <div className='app-body'>
        {lastUpdate === null ? 
          <div className='loading-body'>
            <Loader content='Loading...'/>
          </div> :
          <div className='top'>
            <Columns>
              <Columns.Column paddingless={true} marginless={true} size={8}>
                <VideoPlayer moveAction={moveAction} reactions={reactions} video={currentVideo} current={currentTime} playing={playing} onEnded={() => {
                  socket.connect();
                  socket.emit('next_video', {
                    user: nickname
                  });
                }} onPlay={time => {
                  socket.connect();
                  socket.emit('play_pause', {playing: true});
                }} onPause={time => {
                  socket.connect();
                  socket.emit('play_pause', {playing: false});
                }} addVideo={video => {
                  socket.connect();
                  socket.emit('add_video', video);
                }} addReaction={reaction => {
                  socket.emit('add_reaction', reaction);
                }} onSkipVideo={notif => {

                }} seekVideo={value => {
                  socket.connect();
                  socket.emit('change_player_time', {time: value, user: nickname});
                }} canSkip={videos.length} devMode={DEV_MODE} runTestVideo={() => {
                  socket.emit('test_video', {

                  });
                }}/>
              </Columns.Column>
              <Columns.Column paddingless={true} marginless={true} size={4}>
                <Section pl={1}>
                  <ServerStatus lastUpdate={lastUpdate} status={serverStatus}/>
                  <Sidebar nickname={nickname}
                  updateNickname={new_name => {
                    socket.emit('update_nickname', new_name);
                    setNickname(new_name.new);

                    preferences.set('video-sync-username', new_name.new);
                  }}
                  onSetBanner={value => {
                    socket.emit('set_banner', value);
                  }}
                  removeVideo={video => {
                    socket.emit('remove_video', video);
                  }} playlist={videos} onChangeTab={tab => {
                    setTab(tab);
                  }} moveVideo={payload => {
                      socket.connect();
                      socket.emit('move_video', payload);
                  }}
                  tab={tab} users={users} history={history}/>
                </Section>
              </Columns.Column>
            </Columns>      
          </div>
          }
      <div className='bottom'>
        <Credits/>
      </div>
    </div>
  );
}

export default App;
