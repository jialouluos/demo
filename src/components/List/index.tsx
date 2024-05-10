import style from './index.module.scss';
import { DEMO } from '@/types';
import { VerticalCard } from '../VerticalCard';
interface IProps {
	infos: DEMO[];
}

export const List = ({ infos }: IProps) => {

	return (
		<div className={style.list}>
			{infos.map(item => {
				return (
					<VerticalCard
						info={item}
						key={item.path}
					/>
				);
			})}
		</div>
	);
};
