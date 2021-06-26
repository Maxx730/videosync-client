import ReactPlayer from 'react-player';
import React, {useEffect} from 'react';

export default function Player(props) {

    const PlayerRef = React.createRef();

    useEffect(() => {
        if (Math.abs(props.current - PlayerRef.current.getCurrentTime()) > 1) {
            //PlayerRef.current.seekTo(props.current / PlayerRef.current.getDuration());
        }
    });

    return (
        <>
            {props.current}
            <ReactPlayer ref={PlayerRef} controls playing={props.playing} width={'auto'} height={'auto'} onProgress={progress => {

            }} onPlay={() => {
                props.onPlay && props.onPlay(PlayerRef.current.getCurrentTime());
            }} onPause={() => {
                props.onPause && props.onPause(PlayerRef.current.getCurrentTime());
            }}
            url='https://www.youtube.com/watch?v=ysz5S6PUM-U' />
        </>
    )
}