import ReactPlayer from 'react-player';
import React, {useEffect, useState, createRef, useRef} from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, Emoji } from 'emoji-mart';
import { Section, Block } from 'react-bulma-components';
import Reaction from './Reaction';
import { Progress } from 'react-bulma-components';
import 'rsuite/dist/styles/rsuite-default.css';
import { Slider, Button, IconButton, Icon, Divider } from 'rsuite';
import { BsFillPlayFill } from 'react-icons/bs';

export default function Player(props) {

    let PlayerRef = createRef();
    const [showEmoji, setShowEmoji] = useState(true);
    const [reactions, setReactions] = useState([]);
    const [progress, setProgress] = useState(0);
    const [mouseDown, setMouseDown] = useState(false);

    return (
        <>
            {
                props.video ? <>
                <div className='sync-player'>
                    <ReactPlayer ref={PlayerRef} controls={false} playing={props.playing} width={'auto'} height={'auto'} onProgress={progress => {

            }} onEnded={() => {
                props.onEnded && props.onEnded();
            }} onPlay={() => {
                props.onPlay && props.onPlay(PlayerRef.current.getCurrentTime());
            }} onPause={() => {
                props.onPause && props.onPause(PlayerRef.current.getCurrentTime());
            }} onProgress = {progress => {
                setProgress(progress.played)
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
                        <IconButton color={props.playing ? 'red' : 'green'} icon={<Icon icon={props.playing ? 'pause' : 'play'} />} placement="left">
                            {props.playing ? 'Pause' : 'Play'}
                        </IconButton>
                    </div>
                    <div className={'slider'}>
                        <Slider progress step={0.01} tooltip={false} max={1} min={0} value={!mouseDown ? progress : null} onChange={value => {
                            setProgress(value);
                        }} onMouseDown={event => {
                            setMouseDown(true);
                        }} onMouseUp={event => {
                            setMouseDown(false);
                        }}/>                        
                    </div>
                    <div>
                        <IconButton onClick={() => {
                            props.onEnded();
                            props.onSkipVideo(' skipped the current video.');
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