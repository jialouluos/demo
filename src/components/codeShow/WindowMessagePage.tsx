import { CodeShow } from './CodeShow';
import WindowMessageString from '@/pages/WindowMessage?raw';
import useBCStateString from '@/hooks/useBCState?raw';
import { WindowMessage } from '@/pages/WindowMessage';

export const WindowMessagePage = () => {
	return (
		<>
			<CodeShow
				sources={[
					{
						label: 'WindowMessage',
						value: WindowMessageString,
					},
					{
						label: 'useBCState',
						value: useBCStateString,
					},
				]}>
				<WindowMessage />
			</CodeShow>
		</>
	);
};
