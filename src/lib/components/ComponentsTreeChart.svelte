<script lang="ts">
	import { getContext, onDestroy } from 'svelte';
	import Sigma from 'sigma';
	import type { Bom } from '$lib/cyclonedx/models';
	import type { Coordinates, EdgeDisplayData, NodeDisplayData } from 'sigma/types';
	import type { AbstractGraph, SerializedGraph } from 'graphology-types';
	import { borderSubtle01, borderStrong01, tagTokens, textDisabled } from '@carbon/themes';
	import type { TreeChartState } from '$lib/models/treechart';
	import type { PostMessage } from '$lib/models/worker';
	import Graph from 'graphology';
	import { SkeletonPlaceholder } from 'carbon-components-svelte';
	import {
		getHighlightedGraphState,
		isInterestingEdge,
		isInterestingNode
	} from '$lib/graphs/highlighting';

	let {
		bom,
		selectedComponentRef,
		searchForComponent
	}: { bom: Bom; selectedComponentRef?: string; searchForComponent: (ref?: string) => void } =
		$props();
	const theme: () => string = getContext('theme');

	let container: HTMLDivElement;
	let renderer: Sigma | undefined;
	let graph: AbstractGraph | undefined;
	let isLoading: boolean = $state(true);

	const treeChartState: TreeChartState = {
		hovered: {},
		selected: {}
	};

	let treeGenerationWorker: Worker | undefined = undefined;

	function handleWorkerMessage({ data: { payload } }: MessageEvent<PostMessage<SerializedGraph>>) {
		if (payload) {
			setupGraph(new Graph().import(payload));
		}
	}

	function setupWorker() {
		treeGenerationWorker = new Worker(new URL('$lib/worker/tree-generation.ts', import.meta.url), {
			type: 'module'
		});

		treeGenerationWorker.onmessage = handleWorkerMessage;
	}

	function refreshGraph() {
		// Refresh rendering
		renderer?.refresh({
			// We don't touch the graph data so we can skip its re-indexation
			skipIndexation: true
		});
	}

	function setupGraph(localGraph: Graph) {
		graph = localGraph;

		// Initialize sigma to render the graph
		renderer = new Sigma(graph, container, {
			defaultEdgeType: 'arrow',
			defaultNodeColor: tagTokens.tagTokens.tagColorBlue[theme()],
			defaultEdgeColor: borderSubtle01
		});
		isLoading = false;

		// Bind graph interactions:
		renderer?.on('enterNode', ({ node }) => {
			treeChartState.hovered = getHighlightedGraphState(graph, node);
			refreshGraph();
		});
		renderer?.on('clickNode', ({ node }) => {
			treeChartState.selected = getHighlightedGraphState(graph, node);
			refreshGraph();
		});
		renderer?.on('doubleClickNode', ({ node }) => {
			searchForComponent(node);
		});
		renderer?.on('leaveNode', () => {
			treeChartState.hovered = getHighlightedGraphState(graph);
			refreshGraph();
		});
		renderer?.on('clickStage', () => {
			treeChartState.selected = getHighlightedGraphState(graph);
			refreshGraph();
		});

		// Render nodes accordingly to the internal state:
		// 1. If a node is selected, it is highlighted
		// 3. If there is a hovered node, all nodes that are not on the path from the root the node are greyed out.
		renderer.setSetting('nodeReducer', (node, data) => {
			const res: Partial<NodeDisplayData> = { ...data };

			if (!isInterestingNode(treeChartState, node)) {
				res.label = '';
				res.color = textDisabled;
			}

			if (treeChartState.selected?.targetNode === node) {
				res.highlighted = true;
				res.color = tagTokens.tagTokens.tagColorMagenta[theme()];
			}

			return res;
		});

		// Render edges accordingly to the internal state:
		// 1. If a node is hovered, the edge is hidden if it is not on the shorted path from the root to the node.
		renderer.setSetting('edgeReducer', (edge, data) => {
			const res: Partial<EdgeDisplayData> = { ...data };

			if (isInterestingEdge(treeChartState, edge)) {
				res.color = borderStrong01;
			}

			return res;
		});
	}

	onDestroy(() => {
		treeGenerationWorker?.terminate();
		renderer?.kill();
	});

	$effect(() => {
		if (!treeGenerationWorker) {
			setupWorker();
		}

		if (bom && !graph) {
			isLoading = true;
			treeGenerationWorker?.postMessage({
				payload: bom
			});
		}

		if (selectedComponentRef) {
			treeChartState.selected = getHighlightedGraphState(graph, selectedComponentRef);
			refreshGraph();

			const nodePosition = renderer?.getNodeDisplayData(selectedComponentRef) as Coordinates;
			renderer?.getCamera().animate(
				{ ...nodePosition, ratio: 0.2 },
				{
					duration: 500
				}
			);
		}
	});
</script>

<h2>Dependency Graph</h2>

<p>
	<em>Double click a node to locate it in the dependency table.</em>
</p>

{#if isLoading}
	<SkeletonPlaceholder style="min-height: 50rem; width: 100%;" />
{/if}
<div class="chart-container" bind:this={container}></div>

<style lang="scss">
	@use '@carbon/layout';

	h2 {
		margin-bottom: layout.$spacing-05;
	}

	p {
		margin-bottom: layout.$spacing-05;
	}

	.chart-container {
		width: 100%;
		min-height: 50rem;
	}
</style>
