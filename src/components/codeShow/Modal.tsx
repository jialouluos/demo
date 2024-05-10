import { useState } from 'react';
import style from './index.module.scss';
interface IProps {
	children: React.ReactElement;
	cancel: () => void;
}

export const Modal = ({ children, cancel }: IProps) => {
	const [show, setShow] = useState(true);
	return (
		<div
			className={`${style.modal_mask} ${show ? style.show : style.hidden}`}
			onAnimationEnd={() => {
				!show && cancel();
			}}
			onClick={() => {
				setShow(false);
			}}>
			<div
				className={style.modal_container}
				onClick={e => {
					e.stopPropagation();
				}}>
				{children}
			</div>
		</div>
	);
};
