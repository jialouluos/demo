import { CodeShow } from './CodeShow';
import WebWorkerDemoString from '@/pages/WebWorkerDemo?raw';
import useWebWorkerString from '@/hooks/useWebWorker?raw';
import { WebWorkerDemo } from '@/pages/WebWorkerDemo';

export const WebWorkerDemoPage = () => {
	return (
		<>
			<CodeShow
				sources={[
					{
						label: 'WebWorkerDemo',
						value: WebWorkerDemoString,
					},
					{
						label: 'useWebWorker',
						value: useWebWorkerString,
					},
				]}>
				<WebWorkerDemo />
			</CodeShow>
		</>
	);
};
