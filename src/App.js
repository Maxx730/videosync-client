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
import { Button, IconButton, Icon, Notification } from 'rsuite';
import CustomNouns from './lib/CustomNouns';


const NOTIF_DUR = 2500;
const SERVER = (process.env.NODE_ENV !== 'development') ? window.location.href.indexOf('-dev') > -1 ? 'https://videosync-dev-5zpyb.ondigitalocean.app' : 'https://videosync-ku38p.ondigitalocean.app' : 'localhost:4000';


function App() {
  const socket = socketClient(SERVER, {autoConnect: true});
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
    dictionaries: [adjectives, CustomNouns],
    separator: '',
    style: 'capital',
    length: 2 
  }));
  const [reactions, setReactions] = useState([]);
  const [banner, setBanner] = useState('Now With Chiken');

  useEffect(() => {
    socket.emit('user_login', nickname);

    socket.on('request_current_time', () => {
      if (playing && currentTime) {
        socket.emit('receive_current_time', currentTime);
      }
    });
    
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
          setBanner(payload.banner);
        break;
        case 'add':
          Notification['success']({
            title: `Video Added`,
            description: <><b>{payload.videos[0].snippet.title}</b></>,
            duration: NOTIF_DUR
          });
        break;
        case 'skip':
          Notification['warning']({
            title: `Video Skipped`,
            description: <><b>{payload.user}</b> skipped the current video.</>,
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
        case 'banner':
          setBanner(payload.banner);
        break;
        default: 
        break;
      }

      setHistory(payload.history);
      setUsers(payload.users);
      setVideos(payload.videos);
      setCurrentVideo(payload.video);

      if (!currentVideo) {
        socket.emit('request_current_time');
      }
    });

    socket.on('start_player', value => {
      setPlaying(value);
    });

    socket.on('set_player_time', time => {
      setCurrentTime(time);
    });

    socket.on('set_video', video => {
      setCurrentVideo(video);
    });

    socket.on('changing_player_time', time => {
      setMoveAction({
        time: time,
        complete: false,
        onComplete: () => {
          setMoveAction({complete: false});
        }
      });
    });
  }, []);

  return (
    <>
      <Columns>
        <Columns.Column paddingless={true} marginless={true} size={8}>
          <VideoPlayer moveAction={moveAction} reactions={reactions} video={currentVideo} current={currentTime} playing={playing} onEnded={() => {
            socket.emit('next_video', {
              user: nickname
            });
          }} onPlay={time => {
            socket.emit('playing', {playing: true, current: time});
          }} onPause={time => {
            socket.emit('playing', {playing: false, current: time});
          }} addVideo={video => {
            socket.emit('add_video', video);
          }} addReaction={reaction => {
            socket.emit('add_reaction', reaction);
          }} onSkipVideo={notif => {

          }} seekVideo={value => {
            socket.emit('change_player_time', value);
          }} canSkip={videos.length}/>
        </Columns.Column>
        <Columns.Column paddingless={true} marginless={true} size={4}>
          <Section pl={1}>
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
            }} tab={tab} users={users} history={history}/>
              <Panel>
                <Panel.Block>
                  <IconButton icon={<Icon icon='download'/>} block color='green'>
                    Download Playlist
                  </IconButton>
                </Panel.Block>
              </Panel>
          </Section>
        </Columns.Column>
      </Columns>
      <h1 className={'yikes'}>
        <span>{banner}</span>
      </h1>
    </>
  );
}

export default App;
