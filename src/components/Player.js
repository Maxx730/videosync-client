import ReactPlayer from 'react-player';
import React, {useEffect} from 'react';

export default function Player(props) {

    const PlayerRef = React.createRef();

    useEffect(() => {

    });

    return (
        <>
            {
                props.video ? <ReactPlayer ref={PlayerRef} controls playing={props.playing} width={'auto'} height={'auto'} onProgress={progress => {

            }} onPlay={() => {
                props.onPlay && props.onPlay(PlayerRef.current.getCurrentTime());
            }} onPause={() => {
                props.onPause && props.onPause(PlayerRef.current.getCurrentTime());
            }}
            url={`https://www.youtube.com/watch?v=${props.video.id}`}/> : <div>Playlist Empty</div>
            }

        </>
    )
}