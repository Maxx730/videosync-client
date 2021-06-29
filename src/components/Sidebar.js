import 'bulma/css/bulma.min.css';
import { Button, Section, Box, Panel, PanelBlock, Columns, Form } from 'react-bulma-components';
import Marquee from 'react-fast-marquee';
import { HiUserCircle,HiPlay } from 'react-icons/hi';
import { RiCloseCircleFill } from 'react-icons/ri';
import { useState } from 'react';

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
                tab === 'settings' && RenderSettings(nickname, setNickname, props.updateNickname)
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
                    return <Panel.Block>
                        <Columns>
                            <Columns.Column className={'playlist-item-play'} narrow>
                                <HiPlay size={24}/>
                            </Columns.Column>
                            <Columns.Column>
                                <Marquee className={'playlist-item-title'} loop={1} gradientWidth={5}>
                                    {video.snippet.title}
                                </Marquee>
                            </Columns.Column>
                            <Columns.Column narrow className='remove-video-item'>
                                <RiCloseCircleFill size={24}/>
                            </Columns.Column>
                        </Columns>
                    </Panel.Block>
                }) : <Panel.Block>Playlist is Empty</Panel.Block>
            }
        </>
    )
}

function RenderSettings(nickname, setNickname, updateNickname) {
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
                            updateNickname({old: nickname, new: event.target.value});
                        }} type={'text'} value={nickname}/>
                    </Control>
                </Field>
            </Panel.Block>
        </>
    )
}