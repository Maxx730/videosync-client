import 'bulma/css/bulma.min.css';
import { Button, Section, Box, Panel, PanelBlock } from 'react-bulma-components';

export default function UserList(props) {
    return (
        <Panel>
              <Panel.Tabs className="panel-tabs">
                <Panel.Tabs.Tab active>
                Users
                </Panel.Tabs.Tab>
                <Panel.Tabs.Tab>
                Playlist
                </Panel.Tabs.Tab>
                <Panel.Tabs.Tab>
                Settings
                </Panel.Tabs.Tab>
            </Panel.Tabs>
            {
                props.users && props.users.map(user => {
                    return <Panel.Block renderAs="a">{user.nickname}</Panel.Block>
                })
            }
        </Panel>
    )
}