import type { Bom } from './models';

export function parseJson(dataString: string): Bom {
	return JSON.parse(dataString) as Bom;
}
