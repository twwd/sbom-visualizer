import type { AbstractGraph, SerializedGraph } from 'graphology-types';
import type { PostMessage } from '$lib/models/worker';
import Graph from 'graphology';
import type { Bom } from '$lib/cyclonedx/models';

abstract class GraphWorkerWrapper<PayloadType> {
	private readonly _worker: Worker;
	private readonly _onGraph: (graph: AbstractGraph) => void;

	protected constructor(worker: Worker, onGraph: (graph: AbstractGraph) => void) {
		this._worker = worker;
		this._worker.onmessage = ({
			data: { payload }
		}: MessageEvent<PostMessage<SerializedGraph>>) => {
			if (payload) {
				this._onGraph(new Graph().import(payload));
			}
		};
		this._onGraph = onGraph;
	}

	sendMessage(payload: PayloadType) {
		this._worker.postMessage({
			payload: payload
		});
	}

	terminate() {
		if (this._worker) {
			this._worker.terminate();
		}
	}
}

export class TreeGenerationWorkerWrapper extends GraphWorkerWrapper<Bom> {
	constructor(onGraph: (graph: AbstractGraph) => void) {
		super(
			new Worker(new URL('$lib/worker/tree-generation.ts', import.meta.url), {
				type: 'module'
			}),
			onGraph
		);
	}
}

export class LayoutGraphWorkerWrapper extends GraphWorkerWrapper<SerializedGraph> {
	constructor(onGraph: (graph: AbstractGraph) => void) {
		super(
			new Worker(new URL('$lib/worker/layout-graph.ts', import.meta.url), {
				type: 'module'
			}),
			onGraph
		);
	}
}
