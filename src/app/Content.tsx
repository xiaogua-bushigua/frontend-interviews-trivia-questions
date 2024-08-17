'use client';
import React, { useEffect, useState } from 'react';

export interface List {
	number: string;
	question: string;
	difficulty: number;
	count: number;
}

const Content = () => {
	const [list, setList] = useState([] as Array<List>);
	const handleGeneration = async () => {
		const response = await fetch('/api/file');
		const { data } = await response.json();
		if (data && data.length) {
			setList(data);
			localStorage.setItem('data', JSON.stringify(data));
		}
	};
	const handleDifficulty = async (number: string) => {
		setList((prevList) => {
			const newList = prevList.map((item) => {
				if (item.number === number) {
					return { ...item, difficulty: item.difficulty + 1 };
				}
				return item;
			});
			localStorage.setItem('data', JSON.stringify(newList));
			return newList;
		});
		await fetch('/api/file', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ number }),
		});
	};

	useEffect(() => {
		const data = localStorage.getItem('data');
		if (data) {
			setList(JSON.parse(data));
		}
	}, []);
	return (
		<>
			<button
				onClick={handleGeneration}
				className="bg-blue-500 inline-block hover:bg-blue-700 mb-2 text-white font-bold py-2 px-4 rounded w-32"
			>
				Generate
			</button>
			{list.length === 0 && <span>Click the button to start</span>}
			<ul>
				{list.map((item) => (
					<li className="my-2" key={item.number}>
						<span className="font-bold p-2 bg-red-200 w-12 inline-block rounded-md mr-2">
							{item.number}
						</span>
						<button
							onClick={() => handleDifficulty(item.number)}
							className="bg-slate-500 text-sm hover:bg-slate-700 text-white font-bold py-2 px-4 rounded mr-2"
						>
							{'Difficulty: ' + item.difficulty}
						</button>
						<span className="mr-2 p-2 text-sm rounded-md bg-slate-300">{'Frequency: ' + item.count}</span>
						<span>{item.question}</span>
					</li>
				))}
			</ul>
		</>
	);
};

export default Content;
