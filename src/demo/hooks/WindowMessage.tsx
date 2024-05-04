import { useEffect } from 'react';
import { useSendBCState, useReceiveBCState } from '@/hooks/useBCState';

export default() => {
	const [message, setMessage] = useSendBCState<number>('channel_1', 123);
	const receiveChannel = useReceiveBCState<number>('channel_1', {});

	useEffect(() => {
		console.log(message, 'message');
	}, [message]);
	useEffect(() => {
		console.log(receiveChannel, 'receiveChannel');
	}, [receiveChannel]);
	return (
		<>
			<button onClick={() => setMessage(message + 1)}>点击我</button>
			<br />
			<span>发送:{message}</span>
			<br />
			<span>接受到:{receiveChannel}</span>
		</>
	);
};
