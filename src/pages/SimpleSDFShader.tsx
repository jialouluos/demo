import { SimpleSDF } from '@/demo/shader/simpleSDF';

import { useEffect, useRef } from 'react';

export default () => {
	const isInitFinish = useRef(false);
	const mapEngine = useRef<SimpleSDF | null>(null);

	const init = async (map: SimpleSDF) => {
		try {
			map.render();
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		if (isInitFinish.current) return;
		const map = (mapEngine.current = new SimpleSDF('#canvas_root'));
		init(map);

		isInitFinish.current = true;
		return () => {
			if (isInitFinish.current) return;
			mapEngine.current && mapEngine.current.dispose();
			mapEngine.current = null;
		};
	}, [mapEngine.current]);
	return (
		<>
			<div
				id='canvas_root'
				style={{ width: '100%', height: '100%' }}></div>
		</>
	);
};
