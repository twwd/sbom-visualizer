export interface HighlightedGraphState {
	targetNode?: string;
	highlightedNodes?: Set<string>;
	highlightedEdges?: Set<string>;
}

export interface TreeChartState {
	selected: HighlightedGraphState;
	hovered: HighlightedGraphState;
}
