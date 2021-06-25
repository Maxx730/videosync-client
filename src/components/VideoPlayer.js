import {Section, Box} from 'react-bulma-components';

export default function VideoPlayer(props) {
    return (
        <Section>
            <Box>
                <iframe allow="fullscreen" src="https://www.youtube.com/embed/tgbNymZ7vqY"></iframe>
            </Box>
        </Section>
    )
}