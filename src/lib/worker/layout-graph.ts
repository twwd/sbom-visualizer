import type { PostMessage } from '$lib/models/worker';
import { computeLayoutWithDagre } from '$lib/transformations/graph';
import type { SerializedGraph } from 'graphology-types';
import Graph from 'graphology';

onmessage = ({ data: { payload } }: MessageEvent<PostMessage<SerializedGraph>>) => {
	if (payload) {
		postMessage({
			payload: computeLayoutWithDagre(new Graph().import(payload)).export()
		});
	} else {
		console.error('No BOM received');
	}
};

export {};
