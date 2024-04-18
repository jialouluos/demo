import { ParticleSky } from '@/demo/mesh/particleSky';

import { useEffect, useRef } from 'react';

export const ParticleSkyMesh = () => {
	const isInitFinish = useRef(false);
	const mapEngine = useRef<ParticleSky | null>(null);

	const init = async (map: ParticleSky) => {
		try {
			map.render();
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		if (isInitFinish.current) return;
		const map = (mapEngine.current = new ParticleSky('#canvas_root'));
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
