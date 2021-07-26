import { useEffect } from 'react';
import { Icon } from 'rsuite';

export default function ServerStatus(props) {
    const {status} = props;
    return (
        <div className='server-status'>
            <div className='status-dot'></div>
            Server Status: <span className='status-text'>{status}</span>
            <div className='server-refresh'>
                <Icon icon='refresh' size={8}/><span>{props.lastUpdate}</span>
            </div>
        </div>
    )
}