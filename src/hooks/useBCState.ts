import { useEffect, useCallback, useState, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
type StateInit<T> = T extends any ? T | (() => void | T) : never;
interface IProps<T> {
	namespaces: string;
	onmessage?: (e: MessageEvent<T>) => void;
	onmessageerror?: (e: MessageEvent<T>) => void;
}
export const useSendBCState = <T,>(namespaces: string, initState: StateInit<T>): [T, Dispatch<SetStateAction<T>>] => {
	const [state, setState] = useState<T>(typeof initState === 'function' ? initState() : initState);
	const channel = useMemo(() => {
		return new BroadcastChannel(`${namespaces}__broadcast`);
	}, [namespaces]);

	useEffect(() => {
		channel.postMessage(state);
	}, [state, channel]);

	return [state, setState];
};
export const useReceiveBCState = <T,>(
	namespaces: string,
	{ onmessage, onmessageerror }: Omit<IProps<T>, 'namespaces'>
): T | null => {
	const [state, setState] = useState<T | null>(null);
	const channel = useMemo(() => {
		return new BroadcastChannel(`${namespaces}__broadcast`);
	}, [namespaces]);

	const handleSuccess = useCallback(
		(e: MessageEvent<T>) => {
			onmessage ? onmessage(e) : setState(e.data);
		},
		[setState]
	);

	const handleError = useCallback(
		(e: MessageEvent<T>) => {
			onmessageerror ? onmessageerror(e) : setState(null);
		},
		[setState]
	);

	useEffect(() => {
		channel.addEventListener('message', handleSuccess);
		channel.addEventListener('messageerror', handleError);
		return () => {
			//dispose
			channel.removeEventListener('message', handleSuccess);
			channel.removeEventListener('messageerror', handleError);
		};
	}, [channel]);

	return state;
};
export const useSyncBCState = <T,>(
	{ namespaces, onmessage, onmessageerror }: IProps<T>,
	initState: StateInit<T>
): [T, Dispatch<SetStateAction<T>>] => {
	const [state, setState] = useState<T>(typeof initState === 'function' ? initState() : initState);
	const channel = useMemo(() => {
		return new BroadcastChannel(`${namespaces}__broadcast`);
	}, [namespaces]);

	const handleSuccess = useCallback(
		(e: MessageEvent<T>) => {
			onmessage ? onmessage(e) : setState(e.data);
		},
		[setState]
	);

	const handleError = useCallback(
		(e: MessageEvent<T>) => {
			console.log(33221);
			onmessageerror ? onmessageerror(e) : console.log(e);
		},
		[setState]
	);

	useEffect(() => {
		channel.addEventListener('message', handleSuccess);
		channel.addEventListener('messageerror', handleError);
		return () => {
			//dispose
			channel.removeEventListener('message', handleSuccess);
			channel.removeEventListener('messageerror', handleError);
		};
	}, [channel]);

	useEffect(() => {
		channel.postMessage(state);
	}, [state, channel]);

	return [state, setState];
};
