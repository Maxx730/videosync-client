import ReactPlayer from 'react-player';
import React, {useEffect, useState, createRef, useRef} from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, Emoji } from 'emoji-mart';
import { Section, Block } from 'react-bulma-components';
import Reaction from './Reaction';
import { Progress } from 'react-bulma-components';
import 'rsuite/dist/styles/rsuite-default.css';
import { Slider, Button, IconButton, Icon, Divider, Popover, ButtonToolbar } from 'rsuite';
import { BsFillPlayFill } from 'react-icons/bs';

export default function Player(props) {

    let PlayerRef = createRef();
    const [showEmoji, setShowEmoji] = useState(true);
    const [reactions, setReactions] = useState([]);
    const [progress, setProgress] = useState(0);
    const [mouseDown, setMouseDown] = useState(false);
    const [showVolume, setShowVolume] = useState(false);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (props.moveAction && !props.moveAction.complete) {
            if (PlayerRef) {
                props.moveAction.time && PlayerRef.current.seekTo(props.moveAction.time);
                props.moveAction.onComplete && props.moveAction.onComplete();
            }
        }
    });

    return (
        <>
            {
                props.video ? <>
                <div className='sync-player'>
                    <ReactPlayer volume={volume} ref={PlayerRef} controls={false} playing={props.playing} width={'auto'} height={'auto'} onProgress={progress => {

                    }} onEnded={() => {
                        props.onEnded && props.onEnded();
                    }} onPlay={() => {
                        props.onPlay && props.onPlay(PlayerRef.current.getCurrentTime());
                    }} onPause={() => {
                        props.onPause && props.onPause(PlayerRef.current.getCurrentTime());
                    }} onProgress = {progress => {
                        setDuration(PlayerRef.current.getDuration());
                        setProgress(progress.played)
                    }} onReady={() => {
                        setDuration(PlayerRef.current.getDuration());
                    }}
                    url={`https://www.youtube.com/watch?v=${props.video.id}`}/>
                {
                    renderReactions(props.reactions)
                } 
             </div>
                {
                    false && <>
                        <Picker onSelect={emoji => {
                            props.addReaction && props.addReaction(emoji);
                        }} style={{'width': 'auto'}}/>
                        <Block>
                            <Button onClick={() => {
                                setShowEmoji(!showEmoji);
                            }} fullwidth>{!showEmoji ? 'Hide' : 'Show Emoji'}</Button>
                        </Block>
                    </>
                }
                <Divider/>
                <div className={'player-controls'}>
                    <div>
                        <ButtonToolbar>
                            <IconButton onClick={() => {
                                props.playing ? props.onPause(null) : props.onPlay(null);
                            }} color={props.playing ? 'red' : 'green'} icon={<Icon size={'large'} icon={props.playing ? 'pause' : 'play'} />} placement="left">
                                
                            </IconButton>
                        </ButtonToolbar>
                    </div>
                    <div style={{
                        position: 'relative'
                    }}>
                        {
                            showVolume && <div className='search-shade' onClick={() => {
                                setShowVolume(false);
                            }}></div>
                        }
                        
                        <IconButton style={{
                            marginLeft: 8
                        }} onClick={() => {
                            setShowVolume(true);
                        }} icon={<Icon icon={'volume-up'} />} placement="left">
                        </IconButton>
                        <Popover value={volume} style={{
                            top: -128,
                            left: 10
                        }} visible = {showVolume}>
                            <Slider tooltip={false} onChange={value => {
                                setVolume(1 - value)
                            }} style={{
                                height: 100
                            }} max={1} min={0} step={0.01} vertical/>
                        </Popover>
                    </div>
                    <div className={'slider'}>
                        <div className='timestamps'>
                            {formatVideoTime(progress * duration)} / {formatVideoTime(duration)}
                        </div>
                        <div>
                            <Slider progress step={0.01} tooltip={false} max={1} min={0} value={!mouseDown ? progress : null} onChange={value => {
                                props.seekVideo(value);
                                setProgress(value);
                            }} onMouseDown={event => {
                                setMouseDown(true);
                            }} onMouseUp={event => {
                                setMouseDown(false);
                            }}/>                              
                        </div>
                    </div>
                    <div>
                        <IconButton placement={'right'} onClick={() => {
                            props.onEnded();
                            props.canSkip && props.onSkipVideo({
                                title: 'Video Skipped',
                                description: '{User} skipped the current video.',
                                type: 'warning'
                            });
                        }} icon={<Icon icon='forward' placement='right'/>}>
                            Skip
                        </IconButton>
                    </div>
                </div>
            </> : <div>Playlist Empty</div>
            }
        </>
    )
}

function renderReactions(emojis) {
    return (
        <div className='floating-emoji'>
            {
                emojis.map(emoji => {
                    return <Reaction emoji={{id: emoji.id}}/>
                })
            }
        </div>
    )
}

function formatVideoTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return (minutes > 9 || minutes == 0 ? minutes : '0' + minutes) + ':' + (seconds > 9 ? seconds : '0' + seconds);
}