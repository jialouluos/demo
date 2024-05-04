import { CodeShow } from '../components/codeShow/CodeShow';
import WindowMessageString from '@/demo/hooks/WindowMessage?raw';
import useBCStateString from '@/hooks/useBCState?raw';
import WindowMessage from '@/demo/hooks/WindowMessage';

export default () => {
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
