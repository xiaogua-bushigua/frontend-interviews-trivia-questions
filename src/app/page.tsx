'use client';

import { createContext, useState } from 'react';
import Content from './Content';

const counts = {
	trivia: 10,
	react: 5,
};

type ContextType = {
	type: string;
	refreshCounter: number;
	mode: string;
};

export const MyContext = createContext<ContextType>({ type: 'trivia', refreshCounter: 0, mode: 'default' });

export default function Home() {
	const [state, setState] = useState({ type: 'trivia', refreshCounter: 0, mode: 'default' });

	const handleGeneration = async (type: string) => {
		setState({ ...state, type });
	};

	const handleClickMode = (e: React.MouseEvent<HTMLDivElement>) => {
		localStorage.removeItem(state.type);
		const target = e.target as HTMLElement;
		const m = target.innerText.toLowerCase();
		setState({ ...state, refreshCounter: state.refreshCounter + 1, mode: m });
	};

	return (
		<main className="flex min-h-screen flex-col p-12">
			<header className="flex justify-between">
				<div>
					<span className="font-semibold">Types: </span>
					<button
						onClick={() => handleGeneration('trivia')}
						className={`${
							state.type === 'trivia' ? 'bg-blue-500' : 'bg-gray-500'
						} inline-block hover:bg-blue-700 mb-2 text-white font-bold py-2 px-4 rounded w-32`}
					>
						Trivia
					</button>
					<button
						onClick={() => handleGeneration('react')}
						className={`${
							state.type === 'react' ? 'bg-blue-500' : 'bg-gray-500'
						} inline-block hover:bg-blue-700 mb-2 text-white font-bold py-2 px-4 rounded w-32 mx-4`}
					>
						React
					</button>
				</div>
				<div onClick={handleClickMode}>
					<span className="font-semibold">Refresh Modes: </span>
					<button
						className={`${
							state.mode === 'default' ? 'bg-purple-500' : 'bg-gray-500'
						} hover:bg-purple-700 mb-2 text-white font-bold py-2 px-4 rounded`}
					>
						Default
					</button>
					<button
						className={`${
							state.mode === 'rarest' ? 'bg-purple-500' : 'bg-gray-500'
						} hover:bg-purple-700 mb-2 text-white font-bold py-2 px-4 rounded mx-2`}
					>
						Rarest
					</button>
					<button
						className={`${
							state.mode === 'hardest' ? 'bg-purple-500' : 'bg-gray-500'
						} hover:bg-purple-700 mb-2 text-white font-bold py-2 px-4 rounded`}
					>
						Hardest
					</button>
				</div>
			</header>
			<MyContext.Provider value={state}>
				<Content counts={counts} />
			</MyContext.Provider>
		</main>
	);
}
