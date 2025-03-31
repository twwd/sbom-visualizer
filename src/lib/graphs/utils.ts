import type Graph from 'graphology';
import type { Attributes } from 'graphology-types';

export function getGraphRootNode(graph: Graph<Attributes, Attributes, Attributes>): string {
	return graph.nodes()[0];
}
