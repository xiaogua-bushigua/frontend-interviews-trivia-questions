import fs from 'fs';
import path from 'path';
import { List } from '@/app/Content';
import { NextResponse, NextRequest } from 'next/server';

function getFilePath(fileName: string): string {
	return path.join(process.cwd(), 'public', 'assets', fileName);
}

function readJsonFile(filePath: string): Promise<List[]> {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				console.log('readJsonFile', err);
				return reject(err);
			}
			try {
				const parsedData = JSON.parse(data) as List[];
				resolve(parsedData);
			} catch (jsonErr) {
				reject(jsonErr);
			}
		});
	});
}

function writeJsonFile(data: List[], filePath: string) {
	const jsonData = JSON.stringify(data, null, 2);
	fs.writeFile(filePath, jsonData, 'utf8', (err) => {
		if (err) {
			console.log('writeJsonFile', err);
		}
	});
}

export const POST = async (req: NextRequest) => {
	const { number, type } = await req.json();
	try {
		const filePath = getFilePath(type + '.json');
		const items = await readJsonFile(filePath);
		let writtenItems: List[] = [];

		writtenItems = items.map((item: List) => {
			if (item.number === number) {
				item.difficulty += 1;
			}
			return item;
		});

		writeJsonFile(writtenItems, filePath);

		return NextResponse.json(
			{ data: writtenItems.filter((item) => item.number === number), status: 200 },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ error, status: 500 }, { status: 500 });
	}
};

export const GET = async (req: NextRequest) => {
	const url = new URL(req.url);
	const type = url.searchParams.get('type');
	const mode = url.searchParams.get('mode');
	const limit = url.searchParams.get('count') || '0';
	try {
		const filePath = getFilePath(type + '.json');
		let items = await readJsonFile(filePath);
		let selectedItems: List[] = [];
		let selectedNumbers: string[] = [];
		let writtenItems: List[] = [];
		// 可用索引数组，用于随机选择不重复的列表项
		const availableIndices: number[] = Array.from({ length: items.length }, (_, i) => i);

		while (selectedItems.length < Number(limit) && availableIndices.length > 0) {
			// 每次从 availableIndices 中g根据条件移除一个随机索引。
			// 更新选中的项的 count 属性（加 1）。
			// 将选中的项推入 selectedItems，并记录它们的 number（一个标识符）。
			let index = 0;
			if (mode === 'default') {
				const randomIndex = Math.floor(Math.random() * availableIndices.length);
				index = availableIndices.splice(randomIndex, 1)[0];
			} else if (mode === 'hardest') {
				index = availableIndices.sort((a, b) => items[b].difficulty - items[a].difficulty)[0];
				availableIndices.splice(availableIndices.indexOf(index), 1);
			} else if (mode === 'rarest') {
				index = availableIndices.sort((a, b) => items[a].count - items[b].count)[0];
				availableIndices.splice(availableIndices.indexOf(index), 1);
			}
			items[index].count += 1;
			selectedItems.push(items[index]);
			selectedNumbers.push(items[index].number);
		}

		writtenItems = items.map((item: List) => {
			const indexInSelectedNumbers = selectedNumbers.findIndex((number) => number === item.number);
			if (indexInSelectedNumbers !== -1) return selectedItems[indexInSelectedNumbers];
			return item;
		});

		writeJsonFile(writtenItems, filePath);

		return NextResponse.json({ data: selectedItems, status: 200 }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, status: 500 }, { status: 500 });
	}
};
