import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; // 代码高亮主题风格
import { useState } from 'react';
export const BuildClientArticle = ({
	type,
	sources,
}: {
	type: string;
	sources: { label: string; value: string }[];
}) => {
	const [index, setIndex] = useState(0);
	return (
		<>
			<div>
				<div style={{ display: 'flex', height: '30px' }}>
					{sources.map((item, _index) => {
						return (
							<span
								title={item.label}
								style={{
									textAlign: 'center',
									width: '200px',
									padding: '0px 5px',
									backgroundColor: index === _index ? 'var(--grey-5)' : undefined,
									color: 'var(--grey-7)',
									lineHeight: '30px',
									textOverflow: 'ellipsis',
									overflow: 'hidden',
									wordBreak: 'break-all',
									whiteSpace: 'nowrap',
									cursor: 'pointer',
									borderRadius: '10px 10px 0px 0px',
								}}
								onClick={() => setIndex(_index)}
								key={item.label}>
								{item.label}
							</span>
						);
					})}
				</div>
				{sources[index] ? (
					<SyntaxHighlighter
						customStyle={{
							overflow: 'auto',
							height: '70vh',
							fontSize: '1rem',
							margin: '0px',
						}}
						className='syntax_high_lighter'
						showLineNumbers={true} // 是否展示左侧行数
						lineNumberStyle={{ fontSize: '1rem' }} // 左侧行数的样式
						style={vscDarkPlus} // 主题风格
						language={type} // 需要语言类型 如css, jsx , javascript 等
						PreTag='pre'>
						{String(sources[index].value).replace(/\n$/, '')}
					</SyntaxHighlighter>
				) : (
					<div style={{ height: '40px', textAlign: 'center', fontSize: '18px', lineHeight: '40px' }}>No Content</div>
				)}
			</div>
		</>
	);
};
