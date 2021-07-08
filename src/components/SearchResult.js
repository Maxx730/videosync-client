import {Card, Dropdown, Heading, Image, Columns} from 'react-bulma-components';
import { IconButton, Icon } from 'rsuite';

export default function SearchResult(props) {
    return (
        <Dropdown.Item onClick={event => {
            props.addVideo && props.addVideo(props.video);
        }}>
            <Columns>
                <Columns.Column narrow>
                    <IconButton color='green' icon={<Icon icon="plus" />} />
                </Columns.Column>
                <Columns.Column>
                    <Heading size={6}>
                        {props.video && props.video.snippet.title}
                    </Heading>
                    <Heading subtitle size={6}>
                        {props.video && props.video.snippet.channelTitle}
                    </Heading>
                </Columns.Column>
                <Columns.Column narrow>
                    <IconButton color={'red'} icon={<Icon icon="youtube-play" />} placement="left">
                        Open on YouTube
                    </IconButton>
                </Columns.Column>
            </Columns>
        </Dropdown.Item>
    )
}