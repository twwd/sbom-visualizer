import type { AbstractGraph, SerializedGraph } from 'graphology-types';
import type { PostMessage } from '$lib/models/worker';
import Graph from 'graphology';
import type { Bom } from '$lib/cyclonedx/models';

abstract class GraphWorkerWrapper<PayloadType> {
	private _worker?: Worker;
	private readonly _workerUrl: URL;
	private readonly _onGraph: (graph: AbstractGraph) => void;

	protected constructor(workerUrl: URL, onGraph: (graph: AbstractGraph) => void) {
		this._workerUrl = workerUrl;
		this._onGraph = onGraph;
	}

	get worker() {
		if (!this._worker) {
			this._worker = new Worker(this._workerUrl, {
				type: 'module'
			});

			this._worker.onmessage = ({
				data: { payload }
			}: MessageEvent<PostMessage<SerializedGraph>>) => {
				if (payload) {
					this._onGraph(new Graph().import(payload));
				}
			};
		}
		return this._worker;
	}

	sendMessage(payload: PayloadType) {
		this.worker.postMessage({
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
		super(new URL('$lib/worker/tree-generation.ts', import.meta.url), onGraph);
	}
}

export class LayoutGraphWorkerWrapper extends GraphWorkerWrapper<SerializedGraph> {
	constructor(onGraph: (graph: AbstractGraph) => void) {
		super(new URL('$lib/worker/layout-graph.ts', import.meta.url), onGraph);
	}
}
