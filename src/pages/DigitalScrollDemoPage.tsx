import DigitalScrollDemo from '@/demo/css/DigitalScroll';
import { CodeShow } from '../components/codeShow/CodeShow';
import DigitalScrollDemoString from '@/demo/css/DigitalScroll?raw';

export default () => {
	return (
		<CodeShow
			sources={[
				{
					label: 'DigitalScrollDemo',
					value: DigitalScrollDemoString,
				},
			]}>
			<DigitalScrollDemo />
		</CodeShow>
	);
};
