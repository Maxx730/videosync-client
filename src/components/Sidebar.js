import 'bulma/css/bulma.min.css';
import { Button, Section, Box, Panel, PanelBlock, Columns, Form, Card, Media, Image, Heading, Content } from 'react-bulma-components';
import Marquee from 'react-fast-marquee';
import { HiUserCircle,HiPlay, HiTrash } from 'react-icons/hi';
import { RiCloseCircleFill } from 'react-icons/ri';
import { useState } from 'react';
import { IconButton, Icon } from 'rsuite';

const { Input, Field, Control, Label } = Form;

export default function Sidebar(props) {
    const [nickname,setNickname] = useState(props.nickname);
    const tab = props.tab ? props.tab : 'user';

    return (
        <Panel>
              <Panel.Tabs className="panel-tabs">
                <Panel.Tabs.Tab onClick={event => {
                    props.onChangeTab && props.onChangeTab('users');
                }} active={tab === 'users'}>
                Users
                </Panel.Tabs.Tab>
                <Panel.Tabs.Tab onClick={event => {
                    props.onChangeTab && props.onChangeTab('playlist');
                }} active={tab === 'playlist'}>
                Playlist
                </Panel.Tabs.Tab>
                <Panel.Tabs.Tab onClick={event => {
                    props.onChangeTab && props.onChangeTab('history');
                }} active={tab === 'history'}>
                History
                </Panel.Tabs.Tab>
                <Panel.Tabs.Tab onClick={event => {
                    props.onChangeTab && props.onChangeTab('settings');
                }} active={tab === 'settings'}>
                Settings
                </Panel.Tabs.Tab>
            </Panel.Tabs>
            {
                tab === 'users' && RenderUserList(props.users, props.nickname)
            }
            {
                tab === 'playlist' && RenderPlaylist(props.playlist, props.removeVideo)
            }
            {
                tab === 'settings' && RenderSettings(nickname, setNickname, props.updateNickname, props)
            }
            {
                tab === 'history' && RenderHistory(props.history)
            }
        </Panel>
    )
}

function RenderUserList(users, nickname) {
    return (
        <>
            {
                users && users.map(user => {
                    return <Panel.Block renderAs="a"><HiUserCircle color={nickname === user.nickname ? 'green' : 'black'} size={24}/><span className='userlist-item'>{user.nickname}</span></Panel.Block>
                })
            }
        </>
    )
}

function RenderPlaylist(videos, removeVideo) {
    return (
        <>
            {
                videos && videos.length > 0 ? videos.map(video => {
                    return <Panel.Block style={{
                        'overflow': 'hidden',
                        'position': 'relative',
                        'display': 'block',
                        'border': 'none',
                        'background': 'black'
                    }}>
                                <div className='video-list-item-background' style={{
                                    backgroundImage: `url(${video.snippet.thumbnails.standard ? video.snippet.thumbnails.standard.url : ''})`
                                }}>
                                </div>
                                <Card.Content style={{
                                    height: 100
                                }}>
                                    <div className='video-list-item-info'>
                                        <HiTrash style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            color: '#F44848',
                                            cursor: 'pointer',
                                            zIndex: 999
                                        }} size={24} onClick={() => {
                                            removeVideo(video);
                                        }}/>
                                        <Media style={{
                                            position: 'relative',
                                            display: 'block'
                                        }}>
                                            <Media.Item>
                                                <Heading style={{
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    width: '90%',
                                                    textOverflow: 'ellipsis',
                                                    height: '36px',
                                                    color: 'white'
                                                }} size={4}>{video.snippet.title}</Heading>
                                            </Media.Item>
                                        </Media>
                                        <Content style={{
                                            color: 'white',
                                            width: '90%'
                                        }}>
                                                {video.snippet.description.substring(0, 100)}...
                                        </Content>
                                    </div>
                                </Card.Content>
                            </Panel.Block>
                }) : <Panel.Block>Playlist is Empty</Panel.Block>
            }
        </>
    )
}

function RenderSettings(nickname, setNickname, updateNickname, props) {
    return (
        <>
            <Panel.Block>
                <Field kind="addons" style={{
                    'width': '100%'
                }}>
                    <Control>
                        <Button disabled>
                            Nickname
                        </Button>
                    </Control>
                    <Control fullwidth>
                        <Input onChange = {event => {
                            setNickname(event.target.value)
                        }} type={'text'} value={nickname}/>
                    </Control>
                    {
                        props.nickname !== nickname && 
                        <Control>
                            <Button className='rs-btn-green' onClick={() => {
                                updateNickname({old: props.nickname, new: nickname});
                            }}>
                                Save
                            </Button>
                        </Control>
                    }
                </Field>
            </Panel.Block>
        </>
    )
}

function RenderHistory(history) {
    return (
        <>
            {(history && history.length > 0) ? history.map(item => {
                return (
                    <Panel.Block>
                        <IconButton icon={<Icon icon='clone'/>}>

                        </IconButton>
                        <div className={'history-item-title'}>
                            <Marquee gradientWidth={20} loop={1} pauseOnHover={true}>
                                {item.snippet.title}
                            </Marquee>
                        </div>
                    </Panel.Block>
                )
            }) : 
            <Panel.Block>
                No History    
            </Panel.Block>
            }
        </>
    )
}