import {useEffect, useState} from 'react';
import {Section, Box, Form, Button, Dropdown, Heading, Content} from 'react-bulma-components';
import SearchResult from './SearchResult';
import Player from './Player';
import { HiOutlineSearch } from 'react-icons/hi';
import Marquee from 'react-fast-marquee';
import { IconButton, Icon } from 'rsuite';

const { Input, Field, Control, Label } = Form;
const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=';

export default function VideoPlayer(props) {
    const [loading, setLoading] = useState(false);
    const [searchList, setSearchList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [urlError, setUrlError] = useState(false);

    useEffect(() => {

    },[]);

    return (
        <>
            <Section>
                <Field kind="addons">
                    <Control>
                        <Button disabled>
                            <HiOutlineSearch size={24}/>
                        </Button>
                    </Control>
                    <Control loading={loading} fullwidth>
                        <Input color={urlError ? 'danger' : ''} value={searchTerm} onChange={async event => {
                            event.target.value !== '' && setLoading(true);
                            setSearchTerm(event.target.value);
                            const video = await FindVideo(event.target.value).then(data => {
                                setLoading(false);
                                setUrlError(false);
                                setSearchList(data.items);
                            }).catch(err => {
                                setLoading(false);
                                setUrlError(true);
                                console.log(err);
                            });
                        }} placeholder={'URL'}/>
                    </Control>
                </Field>
                {
                    searchList.length > 0 && renderVideoList(searchList, props.addVideo, () => {
                        setSearchList([]);
                        setSearchTerm('');
                    })
                }
                <Box>
                    <Player canSkip={props.canSkip} seekVideo={props.seekVideo} moveAction={props.moveAction} onSkipVideo={props.onSkipVideo} addReaction={props.addReaction} reactions={props.reactions} video={props.video} current={props.current} playing={props.playing} onPause={props.onPause} onPlay={props.onPlay} onEnded={props.onEnded}></Player>
                </Box>
                {props.video && 
                    <Box>
                        <Heading>
                            <Marquee gradient={false} style={{
                                overflow: 'visible',
                                height: 45
                            }} gradientWidth={10} loop={1}>
                                {props.video.snippet.title}
                            </Marquee>
                        </Heading>
                        <Heading subtitle>
                            {props.video.snippet.channelTitle}
                        </Heading>
                        <Content>
                            <IconButton color={'red'} icon={<Icon icon="youtube-play" />} placement="left">
                                Open on YouTube
                            </IconButton>
                        </Content>
                    </Box>
                }
            </Section>
        </>
    )
}

async function FindVideo(url) {
    return new Promise((resolve, reject) => {
        if (url.includes('youtube.com')) {
            const params = url.split('?');
    
            params.forEach(param => {
                if (param.includes('v=')) {
                    const id = param.substring(2);
    
                    fetch(YOUTUBE_API + id + '&key=AIzaSyAyAX-avp2SMyHFI4fLTb0jAtX4LqbRQWs').then(response => response.json()).then(data => {
                        resolve(data)
                    }).catch(err => {
                        reject(err);
                    });
                }
            });
        } else {
            reject('Url does not contain youtube.com');
        }
    });
}

function renderVideoList(videos, addVideo, callback) {
    return (
        <>
            <div className='search-shade' onClick={() => {
                callback();
            }}>
                
            </div>
            <div style={{
                position: 'relative'
            }}>
                <div className='dropdown-content result-list'>
                    {
                        videos && videos.map(video => {
                            return <SearchResult addVideo={video => {
                                addVideo(video);
                                callback();
                            }} video={video}/>
                        })
                    }
                </div>
            </div>
        </>
    )
}