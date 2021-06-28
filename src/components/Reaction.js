import { Emoji } from 'emoji-mart';
import { useEffect, useState } from 'react';

export default function Reaction(props) {
    const [animating, setAnimating] = useState(false);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setAnimating(true);
        }, 0);

        setTimeout(() => {
            setVisible(false);
        }, 1100);
    }, []);

    return (
        <>
            {
                visible && <div className={`single-reaction ${animating && 'animating'}`}>
                        <Emoji emoji={props.emoji} size={32}/>
                    </div>
            }
        </>
    )
}