import type { PostMessage } from '$lib/models/worker';
import type { Bom } from '$lib/cyclonedx/models';
import { createGraphFromBom } from '$lib/transformations/graph';

onmessage = ({ data: { payload } }: MessageEvent<PostMessage<Bom>>) => {
	if (payload) {
		postMessage({
			payload: createGraphFromBom(payload).export()
		});
	} else {
		console.error('No BOM received');
	}
};

export {};
