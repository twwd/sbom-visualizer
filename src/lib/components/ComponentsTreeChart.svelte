<script lang="ts">
	import { getContext, onDestroy } from 'svelte';
	import Sigma from 'sigma';
	import type { Coordinates, EdgeDisplayData, NodeDisplayData } from 'sigma/types';
	import type { AbstractGraph } from 'graphology-types';
	import { borderSubtle01, borderStrong01, tagTokens, textDisabled } from '@carbon/themes';
	import type { TreeChartState } from '$lib/models/treechart';
	import { SkeletonPlaceholder } from 'carbon-components-svelte';
	import {
		getHighlightedGraphState,
		isInterestingEdge,
		isInterestingNode
	} from '$lib/graphs/highlighting';
	import { LayoutGraphWorkerWrapper } from '$lib/worker/GraphWorkerWrapper';
	import Graph from 'graphology';

	let {
		graph,
		selectedComponentRef,
		searchForComponent
	}: {
		graph: AbstractGraph | null;
		selectedComponentRef?: string;
		searchForComponent?: (ref: string) => void;
	} = $props();
	const theme: () => string = getContext('theme');

	let internalGraph: Graph | undefined = $state();
	let lastUnprocessedGraph: Graph | undefined = $state();

	let container: HTMLDivElement;
	let renderer: Sigma | undefined;

	const treeGenerationWorkerWrapper = new LayoutGraphWorkerWrapper((g: Graph) => {
		internalGraph = g;
		setupGraph();
	});

	let isLoading: boolean = $derived(graph === null);

	const treeChartState: TreeChartState = {
		hovered: {},
		selected: {}
	};

	function refreshGraph() {
		// Refresh rendering
		renderer?.refresh({
			// We don't touch the graph data so we can skip its re-indexation
			skipIndexation: true
		});
	}

	function setupGraph() {
		if (!internalGraph) {
			return;
		}

		// Stop old renderer and reset chart state
		if (renderer) {
			renderer.kill();
			treeChartState.hovered = {};
			treeChartState.selected = {};
		}
		// Initialize sigma to render the internalGraph
		renderer = new Sigma(internalGraph, container, {
			defaultEdgeType: 'arrow',
			defaultNodeColor: tagTokens.tagTokens.tagColorBlue[theme()],
			defaultEdgeColor: borderSubtle01
		});

		// Bind internalGraph interactions:
		renderer?.on('enterNode', ({ node }) => {
			treeChartState.hovered = getHighlightedGraphState(internalGraph, node);
			refreshGraph();
		});
		renderer?.on('clickNode', ({ node }) => {
			treeChartState.selected = getHighlightedGraphState(internalGraph, node);
			refreshGraph();
		});
		renderer?.on('doubleClickNode', ({ node }) => {
			if (searchForComponent) {
				searchForComponent(node);
			}
		});
		renderer?.on('leaveNode', () => {
			treeChartState.hovered = getHighlightedGraphState(internalGraph);
			refreshGraph();
		});
		renderer?.on('clickStage', () => {
			treeChartState.selected = getHighlightedGraphState(internalGraph);
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
		renderer?.kill();
		treeGenerationWorkerWrapper?.terminate();
	});

	$effect(() => {
		if (graph !== null && graph !== lastUnprocessedGraph) {
			lastUnprocessedGraph = graph;
			treeGenerationWorkerWrapper.sendMessage(graph.export());
		}

		if (internalGraph) {
			if (selectedComponentRef) {
				treeChartState.selected = getHighlightedGraphState(internalGraph, selectedComponentRef);
				refreshGraph();

				const nodePosition = renderer?.getNodeDisplayData(selectedComponentRef) as Coordinates;
				renderer?.getCamera().animate(
					{ ...nodePosition, ratio: 0.2 },
					{
						duration: 500
					}
				);
			}
		}
	});
</script>

{#if isLoading}
	<SkeletonPlaceholder style="min-height: 50rem; width: 100%;" />
{/if}
<div style="min-height: 50rem; width: 100%;" bind:this={container}></div>
