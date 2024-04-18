import { ParticleTrack } from '@/demo/mesh/particleTrack';

import { useEffect, useRef } from 'react';

export const ParticleTrackMesh = () => {
	const isInitFinish = useRef(false);
	const mapEngine = useRef<ParticleTrack | null>(null);

	const init = async (map: ParticleTrack) => {
		try {
			map.render();
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		if (isInitFinish.current) return;
		const map = (mapEngine.current = new ParticleTrack('#canvas_root'));
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