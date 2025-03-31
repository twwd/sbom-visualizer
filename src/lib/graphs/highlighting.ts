import type { HighlightedGraphState, TreeChartState } from '$lib/models/treechart';
import { allSimplePaths } from 'graphology-simple-path';
import { edgePathFromNodePath } from 'graphology-shortest-path';
import type Graph from 'graphology';
import { getGraphRootNode } from '$lib/graphs/utils';

export function isInterestingNode(treeChartState: TreeChartState, node: string): boolean {
	if (!treeChartState.hovered.targetNode && !treeChartState.selected.targetNode) {
		return true;
	}
	for (const chartState of [treeChartState.hovered, treeChartState.selected]) {
		if (
			chartState.targetNode &&
			(chartState.highlightedNodes?.has(node) || chartState.targetNode === node)
		) {
			return true;
		}
	}
	return false;
}

export function isInterestingEdge(treeChartState: TreeChartState, edge: string): boolean {
	if (!treeChartState.hovered.targetNode && !treeChartState.selected.targetNode) {
		return true;
	}

	for (const chartState of [treeChartState.hovered, treeChartState.selected]) {
		if (chartState.targetNode && chartState.highlightedEdges?.has(edge)) {
			return true;
		}
	}
	return false;
}

export function getHighlightedGraphState(graph?: Graph, node?: string) {
	const graphState: HighlightedGraphState = {};
	if (node) {
		graphState.targetNode = node;
		if (graph) {
			const root = getGraphRootNode(graph);
			const paths = allSimplePaths(graph, root, node);
			if (paths) {
				graphState.highlightedNodes = paths.reduce(
					(p, c) => p.union(new Set(c)),
					new Set<string>()
				);
				graphState.highlightedEdges = paths.reduce(
					(p, c) => p.union(new Set(edgePathFromNodePath(graph!, c))),
					new Set<string>()
				);
			}
		} else {
			console.warn('No graph found');
		}
	}
	return graphState;
}
