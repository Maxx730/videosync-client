import ReactPlayer from 'react-player';
import React, {useEffect, useState, createRef, useRef} from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, Emoji } from 'emoji-mart';
import { Button, Section, Block } from 'react-bulma-components';
import Reaction from './Reaction';
import { Progress } from 'react-bulma-components';
import 'rsuite/dist/styles/rsuite-default.css';
import { Slider, RangeSlider } from 'rsuite';

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
                <div className={'player-controls'}>
                    <Slider progress step={0.01} tooltip={false} max={1} min={0} value={!mouseDown ? progress : null} onChange={value => {
                        setProgress(value);
                    }} onMouseDown={event => {
                        setMouseDown(true);
                    }} onMouseUp={event => {
                        setMouseDown(false);
                    }}/>
                </div>
                <Section fullwidth paddingless>
                    <Button onClick={() => {
                        props.onEnded();
                        props.onSkipVideo(' skipped the current video.');
                    }} fullwidth my={1}>
                        Skip
                    </Button>
                </Section>
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