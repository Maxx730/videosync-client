import { useEffect, useState } from 'react';
import { Button, Section, Box, Panel, PanelBlock, Columns, Form, Card, Media, Image, Heading, Content } from 'react-bulma-components';
import { Divider } from 'rsuite';

const { Input, Field, Control, Label } = Form;

export default function Chat() {
    const [showUsers, setShowUsers] = useState(false);

    return (
        <>
            <Panel.Tabs className="panel-tabs">
                <Panel.Tabs.Tab onClick={() => setShowUsers(false)} active={!showUsers}>
                    Chat
                </Panel.Tabs.Tab>
                <Panel.Tabs.Tab onClick={() => setShowUsers(true)} active={showUsers}>
                    Users
                </Panel.Tabs.Tab>
            </Panel.Tabs>
            {
                !showUsers && <>
                    <div style={{
                        'padding': 10
                    }}>
                        <Field kind="addons">
                            <Control fullwidth>
                                <Input/>
                            </Control>
                            <Control>
                                <Button>
                                    Send
                                </Button>
                            </Control>
                        </Field>
                    </div>
                </>
            }
        </>
    )
}