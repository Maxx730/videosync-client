import 'bulma/css/bulma.min.css';
import { Button, Section, Box, Panel, PanelBlock, Columns } from 'react-bulma-components';
import Marquee from 'react-fast-marquee';

export default function Sidebar(props) {
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
                tab === 'users' && RenderUserList(props.users)
            }
            {
                tab === 'playlist' && RenderPlaylist(props.playlist, props.removeVideo)
            }
            {
                tab === 'settings' && RenderSettings()
            }
        </Panel>
    )
}

function RenderUserList(users) {
    return (
        <>
            {
                users && users.map(user => {
                    return <Panel.Block renderAs="a">{user.nickname}</Panel.Block>
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
                            <Columns.Column>
                                <Marquee loop={1} gradientWidth={10}>
                                    {video.snippet.title}
                                </Marquee>
                            </Columns.Column>
                            <Columns.Column narrow className='remove-video-item'>
                                <Button remove onClick={() => {
                                    removeVideo(video);
                                }}/>
                            </Columns.Column>
                        </Columns>
                    </Panel.Block>
                }) : <Panel.Block>Playlist is Empty</Panel.Block>
            }
        </>
    )
}

function RenderSettings() {
    return (
        <>
            working
        </>
    )
}