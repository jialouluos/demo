import { LineMergeDrawMesh } from '@/demo/mesh/LineMergeDrawMesh';

import { useEffect, useRef } from 'react';

export default () => {
	const isInitFinish = useRef(false);
	const mapEngine = useRef<LineMergeDrawMesh | null>(null);

	const init = async (map: LineMergeDrawMesh) => {
		try {
			map.render();
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		if (isInitFinish.current) return;
		const map = (mapEngine.current = new LineMergeDrawMesh('#canvas_root'));
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
