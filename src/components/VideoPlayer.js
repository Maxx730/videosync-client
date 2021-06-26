import {useEffect, useState} from 'react';
import {Section, Box, Form, Button, Dropdown} from 'react-bulma-components';
import SearchResult from './SearchResult';

const { Input, Field, Control, Label } = Form;
const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=';

export default function VideoPlayer(props) {
    const [loading, setLoading] = useState(false);
    const [searchList, setSearchList] = useState([]);

    useEffect(() => {

    },[]);

    return (
        <>
            <Section>
                <Field kind="addons">
                    <Control>
                        <Button disabled>
                            Search
                        </Button>
                    </Control>
                    <Control loading={loading} fullwidth>
                        <Input onChange={async event => {
                            setLoading(true);
                            const video = await FindVideo(event.target.value).then(data => {
                                setLoading(false);
                                setSearchList(data.items);
                            }).catch(err => {
                                console.log(err);
                            });
                        }} placeholder={'URL'}/>
                    </Control>
                </Field>
                {
                    searchList.length > 0 && renderVideoList(searchList, props.addVideo, () => {
                        setSearchList([]);
                    })
                }
                <Box>
                    <iframe allow="fullscreen" src="https://www.youtube.com/embed/tgbNymZ7vqY"></iframe>
                </Box>
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
                        console.log(err);
                        reject(err);
                    });
                }
            });
        }
    });
}

function renderVideoList(videos, addVideo, callback) {
    return (
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
    )
}