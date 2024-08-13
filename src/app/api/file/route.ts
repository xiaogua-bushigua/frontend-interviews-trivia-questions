import fs from 'fs';
import path from 'path';
import { List } from '@/app/Content';
import { NextResponse, NextRequest } from 'next/server';

function getFilePath(fileName: string): string {
	return path.join(process.cwd(), 'public', 'assets', fileName);
}

const filePath = getFilePath('data.json');

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
			console.log("writeJsonFile" ,err);
		}
	});
}

export const GET = async () => {
	const limit = 12;
	try {
		const items = await readJsonFile(filePath);
		let selectedItems: List[] = [];
		let selectedNumbers: string[] = [];
		let writtenItems: List[] = [];
		const availableIndices: number[] = Array.from({ length: items.length }, (_, i) => i);

		while (selectedItems.length < limit && availableIndices.length > 0) {
			const randomIndex = Math.floor(Math.random() * availableIndices.length);
			const index = availableIndices.splice(randomIndex, 1)[0];
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

export const POST = async (req: NextRequest) => {
	const { number } = await req.json();
	try {
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
