import './App.css';
import socketClient from 'socket.io-client';
import {useEffect, useState} from 'react';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import Sidebar from './components/Sidebar';
import VideoPlayer from 'components/VideoPlayer';
import {Columns, Tabs, Section} from 'react-bulma-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SERVER = process.env.NODE_ENV === 'development' ? 'https://videosync-dev-5zpyb.ondigitalocean.app' : 'https://videosync-ku38p.ondigitalocean.app';

const custom_nouns = [
  'penis',
  'shaft',
  'balls',
  'vagina',
  'snatch',
  'fronthole',
  'pube',
  'clit',
  'taint',
  'cunt',
  'squirter',
  'butthole',
  'asspipe',
  'tit',
  'nipple',
  'boner',
  'shaft',
  'beefcurtains',
  'dildo',
  'fleshlight',
  'genital',
  'gash'
];

function App() {
  const socket = socketClient(SERVER, {autoConnect: true});
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState('playlist');
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [nickname, setNickname] = useState(uniqueNamesGenerator({ 
    dictionaries: [adjectives, custom_nouns],
    separator: '',
    style: 'capital',
    length: 2 
  }));
  const [reactions, setReactions] = useState([]);

  useEffect(() => {
    socket.emit('user_login', nickname);
    
    socket.on('users_updated', users => {
      const user = users.users[users.users.length - 1].nickname;
      if (user !== nickname) {
        toast(user + ' Joined!',{
          type: toast.TYPE.INFO, 
          pauseOnFocusLoss: false,
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }

      setUsers(users.users);
      setVideos(users.videos);
    });

    socket.on('history_updated', history => {
      setHistory(history);
    });

    socket.on('start_player', value => {
      setPlaying(value);
    });

    socket.on('videos_updated', videos => {
      if (videos.length > 0) {
        const video = videos[videos.length - 1].snippet.title;

        toast(video + ' Added!',{
          type: toast.TYPE.SUCCESS, 
          pauseOnFocusLoss: false,
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }
      setVideos(videos);
    });

    socket.on('set_player_time', time => {
      setCurrentTime(time);
    });

    socket.on('set_video', video => {
      setCurrentVideo(video);
    });

    socket.on('show_reaction', reaction => {
      const reacts = [...reactions];
      reacts.push(reaction);
      setReactions(reacts);
    });

    socket.on('notify', payload => {
      toast(payload.user + payload.action, {
        type: toast.TYPE.INFO,
        pauseOnFocusLoss: false,
        position: toast.POSITION.BOTTOM_RIGHT
      });
    });
  }, []);

  return (
    <>
      <Columns>
        <Columns.Column paddingless={true} marginless={true} size={8}>
          <VideoPlayer reactions={reactions} video={currentVideo} current={currentTime} playing={playing} onEnded={() => {
            socket.emit('next_video');
          }} onPlay={time => {
            socket.emit('playing', {playing: true, current: time});
          }} onPause={time => {
            socket.emit('playing', {playing: false, current: time});
          }} addVideo={video => {
            socket.emit('add_video', video);
          }} addReaction={reaction => {
            socket.emit('add_reaction', reaction);
          }} onSkipVideo={message => {
            socket.emit('notify', {user: nickname, action: message});
          }}/>
        </Columns.Column>
        <Columns.Column paddingless={true} marginless={true} size={4}>
          <Section pl={1}>
            <Sidebar nickname={nickname}
            updateNickname={new_name => {
              socket.emit('update_nickname', new_name);
              setNickname(new_name.new);
            }} removeVideo={video => {
              socket.emit('remove_video', video);
            }} playlist={videos} onChangeTab={tab => {
              setTab(tab);
            }} tab={tab} users={users}/>
          </Section>
        </Columns.Column>
      </Columns>
      <ToastContainer />
    </>
  );
}

export default App;
