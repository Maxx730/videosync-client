import {Card, Dropdown, Heading, Image, Columns} from 'react-bulma-components';

export default function SearchResult(props) {
    return (
        <Dropdown.Item renderAs='a' onClick={event => {
            props.addVideo && props.addVideo(props.video);
        }}>
            <Columns>
                <Columns.Column narrow>
                    <Image size={128} src={props.video ? props.video.snippet.thumbnails.default.url : ''}></Image>
                </Columns.Column>
                <Columns.Column>
                    <Heading size={6}>
                        {props.video && props.video.snippet.title}
                    </Heading>
                    <Heading subtitle size={6}>
                        {props.video && props.video.snippet.channelTitle}
                    </Heading>
                </Columns.Column>
            </Columns>
        </Dropdown.Item>
    )
}