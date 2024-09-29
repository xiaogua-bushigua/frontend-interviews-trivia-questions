'use client';

import { createContext, useState } from 'react';
import Content from './Content';

type ContextType = {
	type: string;
	refreshCounter: number;
};

export const MyContext = createContext<ContextType>({ type: 'trivia', refreshCounter: 0 });

export default function Home() {
	const [state, setState] = useState({ type: 'trivia', refreshCounter: 0 });

	const handleGeneration = async (type: string) => {
		setState({ ...state, type });
	};

	const handleRefresh = () => {
		localStorage.removeItem(state.type);
    setState({ ...state, refreshCounter: state.refreshCounter + 1 });
	};

	return (
		<main className="flex min-h-screen flex-col p-12">
			<header>
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
				<button
					onClick={handleRefresh}
					className="bg-pink-500 inline-block hover:bg-pink-700 mb-2 text-white font-bold py-2 px-4 rounded"
				>
					refresh
				</button>
			</header>
			<MyContext.Provider value={state}>
				<Content />
			</MyContext.Provider>
		</main>
	);
}
