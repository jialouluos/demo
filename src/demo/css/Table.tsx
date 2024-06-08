import style from './index.module.scss';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { cancelAppoint } from '../../utils/cancelAppoint';
import { Button, Modal, Input, message, Tooltip, Typography } from 'antd';
const { Paragraph, Text, Link, Title } = Typography;
const size = 3;
const unit = 'rem';
const computeRem = val => {
	return `calc(${val} / 60 * ${size}${unit} )`;
};
export const TimeLineWapper = ({ timeTitle, timeInfo, onOk }) => {
	const [subscribeDetail, setSubscribeDetail] = useState(null);
	// 取消预约权
	const handleCancel = value => {
		Modal.confirm({
			title: '温馨提醒',
			icon: <ExclamationCircleOutlined />,
			content: `您确定要取消 ${value.userName} 对于 ${value.meetingRoom} 房间的 ${value.day} ${value.subscribeTime}预约吗？`,
			okText: '确认',
			cancelText: '取消',
			onOk: async () => {
				await cancelAppoint({ id: value.id })
					.then(res => {
						if (res.data.msg === '操作成功') {
							message.success('取消预约成功！');
							handleDetailModelCancel();
							onOk && onOk();
						} else {
							return Promise.reject({ message: '操作失败' });
						}
					})
					.catch(err => {
						message.error(err?.message ?? '操作异常');
					});
			},
		});
	};
	const openModal = item => {
		setSubscribeDetail(item);
	};

	const handleDetailModelCancel = () => {
		setSubscribeDetail(null);
	};
	const getStatusClassName = status => {
		switch (status) {
			case '已预约':
				return style.doSubscribed;
			case '已完成':
				return style.doComplete;
			case '过期预约':
				return style.doExpireSubscribe;
			default:
				return style.do;
		}
	};

	return (
		<>
			<div className={style.timeLineWapper}>
				<h4 style={{ height: `${size}${unit}` }}>{timeTitle}</h4>
				<div>
					{Array.from({ length: 18 }).map(item => {
						return <span style={{ height: `${size}${unit}` }}></span>;
					})}
					{(timeInfo ?? []).map(item => {
						return (
							<span
								onClick={() => openModal(item)}
								style={{
									top: computeRem(item.offsetWidth),
									height: computeRem(item.width),
									position: 'absolute',
								}}
								className={getStatusClassName(item?.status)}>
								<Tooltip title={`${item?.reason ?? ''}(${item?.userName ?? '未知人员'})`}>
									<Paragraph ellipsis={{ rows: 2 }}>{`${item?.reason ?? ''}(${
										item?.userName ?? '未知人员'
									})`}</Paragraph>
								</Tooltip>
							</span>
						);
					})}
				</div>
			</div>

			<Modal
				title='预约详情'
				open={!!subscribeDetail}
				onCancel={handleDetailModelCancel}
				width={400}
				height={500}
				footer={[
					<Button
						key='back'
						onClick={handleDetailModelCancel}>
						关闭
					</Button>,
				]}>
				<div>
					<span>预约人：</span>
					<Input
						disabled
						value={subscribeDetail?.userName}
					/>
				</div>
				<div>
					<span>房间名：</span>
					<Input
						disabled
						value={subscribeDetail?.meetingRoom}
					/>
				</div>
				<div>
					<span>创建时间：</span>
					<Input
						disabled
						value={subscribeDetail?.createTime}
					/>
				</div>
				<div>
					<span>使用时间：</span>
					<Input
						disabled
						value={subscribeDetail?.day + ' ' + subscribeDetail?.subscribeTime}
					/>
				</div>
				<div>
					<span>预约理由：</span>
					<Input
						disabled
						value={subscribeDetail?.reason}
					/>
				</div>
				<div>
					<span>预约状态：</span>
					<Input
						disabled
						value={subscribeDetail?.status}
					/>
				</div>
				<div style={{ textAlign: 'center', padding: '1rem 0rem 0rem 0rem' }}>
					{' '}
					{subscribeDetail?.status === '已预约' && (
						<Button
							type='primary'
							size='small'
							danger
							onClick={() => handleCancel(subscribeDetail)}>
							取消预约
						</Button>
					)}
				</div>
			</Modal>
		</>
	);
};

export const HoursLine = () => {
	return (
		<div className={style.hoursLineWapper}>
			<h4 style={{ height: `${size}${unit}` }}>{'GMT+8'}</h4>
			<div style={{ top: `-${size / 2}${unit}` }}>
				{Array.from({ length: 18 })
					.map((_, index) => index + 6 + ':00')
					.map(item => {
						return <span style={{ height: `${size}${unit}` }}>{item}</span>;
					})}
			</div>
		</div>
	);
};
