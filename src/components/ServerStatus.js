import { useEffect } from 'react';

export default function ServerStatus(props) {
    const {status} = props;
    return (
        <div className='server-status'>
            <div className='status-dot'></div>
            Server Status: <span className='status-text'>{status}</span>
            <div className=''>
                {props.lastUpdate}
            </div>
        </div>
    )
}