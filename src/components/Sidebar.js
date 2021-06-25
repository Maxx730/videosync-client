import 'bulma/css/bulma.min.css';
import { Button, Section, Box, Panel, PanelBlock } from 'react-bulma-components';

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
                tab === 'playlist' && RenderPlaylist(props.videos)
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

function RenderPlaylist(videos) {
    return (
        <>
            {
                
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