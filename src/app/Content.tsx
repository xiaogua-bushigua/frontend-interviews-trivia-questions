'use client';

import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { MyContext } from './page';

export interface List {
	number: string;
	question: string;
	difficulty: number;
	count: number;
}

const Content = ({ counts }: { counts: Record<string, number> }) => {
	const [list, setList] = useState([] as Array<List>);
	const { type, refreshCounter, mode } = useContext(MyContext);

	const handleDifficulty = async (number: string, type: string) => {
		setList((prevList) => {
			const newList = prevList.map((item) => {
				if (item.number === number) {
					return { ...item, difficulty: item.difficulty + 1 };
				}
				return item;
			});
			localStorage.setItem(type, JSON.stringify(newList));
			return newList;
		});
		await fetch('/api/file', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ number, type }),
		});
	};

	const fetchData = async (type: string, mode: string) => {
		const response = await fetch(`/api/file?type=${type}&count=${counts[type]}&mode=${mode}`);
		const { data } = await response.json();
		if (data && data.length) {
			setList(data);
			localStorage.setItem(type, JSON.stringify(data));
		}
	};

	useEffect(() => {
		const data = localStorage.getItem(type);
		if (data) {
			setList(JSON.parse(data));
		} else {
			fetchData(type, mode);
		}
	}, [type, refreshCounter, mode]);

	return (
		<div>
			<ul>
				{list.map((item) => (
					<li className="my-2" key={item.number}>
						<span className="font-bold select-none p-2 bg-red-200 w-12 inline-block rounded-md mr-2">
							{item.number}
						</span>
						<button
							onClick={() => handleDifficulty(item.number, type)}
							className="bg-slate-500 select-none text-sm hover:bg-slate-700 w-32 text-white font-bold py-2 rounded mr-2"
						>
							{'Difficulty: ' + item.difficulty}
						</button>
						<span className="mr-2 p-2 select-none text-sm rounded-md w-24 bg-slate-300">
							{'Frequency: ' + item.count}
						</span>
						<span>{item.question}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Content;
