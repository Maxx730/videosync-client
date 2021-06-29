import ReactPlayer from 'react-player';
import React, {useEffect, useState, createRef} from 'react';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, Emoji } from 'emoji-mart';
import { Button, Section, Block } from 'react-bulma-components';
import Reaction from './Reaction';

export default function Player(props) {

    const PlayerRef = React.createRef();
    const [showEmoji, setShowEmoji] = useState(true);
    const [reactions, setReactions] = useState([]);

    useEffect(() => {

    });

    return (
        <>
            {
                props.video ? <>
                <div className='sync-player'>
                    <ReactPlayer ref={PlayerRef} controls playing={props.playing} width={'auto'} height={'auto'} onProgress={progress => {

            }} onEnded={() => {
                props.onEnded && props.onEnded();
            }} onPlay={() => {
                props.onPlay && props.onPlay(PlayerRef.current.getCurrentTime());
            }} onPause={() => {
                props.onPause && props.onPause(PlayerRef.current.getCurrentTime());
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
                <Section fullwidth paddingless>
                    <Button onClick={() => {
                        props.onEnded();
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