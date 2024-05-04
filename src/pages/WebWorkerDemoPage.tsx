import { CodeShow } from '../components/codeShow/CodeShow';
import WebWorkerDemoString from '@/pages/WebWorkerDemo?raw';
import useWebWorkerString from '@/hooks/useWebWorker?raw';
import WebWorkerDemo from '@/demo/hooks/WebWorkerDemo';

export default () => {
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
