import { useState } from 'react';
import { Modal } from './Modal';

import { BuildClientArticle } from './BuildClientArticle';
interface IProps {
	sources: { label: string; value: string }[];
	children: React.ReactElement;
}

export const CodeShow = ({ sources, children }: IProps) => {
	const [_, setShow] = useState(false);
	return (
		<>
			{children}

			{_ ? (
				<Modal cancel={() => setShow(false)}>
					<BuildClientArticle
						type={'tsx'}
						sources={sources}
					/>
				</Modal>
			) : (
				<div
					style={{
						position: 'fixed',
						top: '60px',
						right: '60px',
						backgroundColor: 'var(--grey-3)',
						lineHeight: '30px',
						borderRadius: '5px',
						textAlign: 'center',
						width: '80px',
						height: '30px',
						cursor: 'pointer',
					}}
					onClick={() => setShow(true)}>
					查看代码
				</div>
			)}
		</>
	);
};
