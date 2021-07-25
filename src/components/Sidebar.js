import 'bulma/css/bulma.min.css';
import { Button, Section, Box, Panel, PanelBlock, Columns, Form, Card, Media, Image, Heading, Content } from 'react-bulma-components';
import Marquee from 'react-fast-marquee';
import { HiUserCircle,HiPlay, HiTrash } from 'react-icons/hi';
import { RiCloseCircleFill } from 'react-icons/ri';
import { useState } from 'react';
import { IconButton, Icon, ButtonGroup, List } from 'rsuite';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import CustomNouns from 'lib/CustomNouns';

const { Input, Field, Control, Label } = Form;

export default function Sidebar(props) {
    const [nickname,setNickname] = useState(props.nickname);
    const [randomName, setRandomName] = useState(null);
    const tab = props.tab ? props.tab : 'user';

    useState(() => {
        setNickname(props.nickname);
    });

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
                tab === 'settings' && RenderSettings(nickname, setNickname, props.updateNickname, props, randomName, setRandomName, {
                    onSetBanner: props.onSetBanner
                })
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
        <Content style={{
            padding: 12
        }}>
            <List bordered>
            {
                videos && videos.length > 0 ? videos.map(video => {
                    return <List.Item>
                                <Card.Content>
                                    <div className='video-list-item-info'>
                                        <div className=''>
                                            <ButtonGroup vertical>
                                                <IconButton icon={<Icon icon='caret-up'/>}/>
                                                <IconButton icon={<Icon icon='caret-down'/>}/>
                                            </ButtonGroup>
                                        </div>
                                        <Media style={{
                                            position: 'relative',
                                            display: 'block'
                                        }}>
                                            <Media.Item style={{
                                                fontWeight: 'bold'
                                            }}>
                                                {video.snippet.title}
                                            </Media.Item>
                                        </Media>
                                        <Content style={{
                                            width: '90%'
                                        }}>
                                                {video.snippet.description.substring(0, 100)}...
                                        </Content>
                                    </div>
                                </Card.Content>
                            </List.Item>
                }) : <Panel.Block>Playlist is Empty</Panel.Block>
            }
            </List>
        </Content>
    )
}

function RenderSettings(nickname, setNickname, updateNickname, props, randomName, setRandomName, methods) {
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
            <Panel.Block>
                <Field kind='addons' style={{
                    'width': '100%'
                }}>
                    <Control>
                        <Button onClick={() => {
                            const name = uniqueNamesGenerator({ 
                                dictionaries: [adjectives, CustomNouns],
                                separator: '',
                                style: 'capital',
                                length: 2 
                            });
                            methods.onSetBanner && methods.onSetBanner(name);
                            setRandomName(
                                name
                            );
                        }}>
                            Generate Name
                        </Button>
                    </Control>
                    <Control fullwidth>
                        <Input value={randomName}/>
                    </Control>
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