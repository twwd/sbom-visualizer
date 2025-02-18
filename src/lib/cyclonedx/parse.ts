import type { Bom } from './models';

export function parseJson(dataString: string): Bom | null {
	try {
		return JSON.parse(dataString) as Bom;
	} catch (e) {
		console.error(`BOM could not be parsed: ${e}`);
	}
	return null;
}
