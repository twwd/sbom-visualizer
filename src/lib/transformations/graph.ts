import type { Bom, Component, Dependency } from '$lib/cyclonedx/models';
import dagre from '@dagrejs/dagre';
import Graph from 'graphology';

function addNodes(graph: Graph, components: Component[] | undefined): void {
	if (!components) {
		return;
	}

	for (const component of components) {
		if (component['bom-ref']) {
			graph.addNode(component['bom-ref'], { label: component.name });
		}
	}
}

function addEdges(graph: Graph, dependencies: Dependency[] | undefined): void {
	if (!dependencies) {
		return;
	}

	for (const dependency of dependencies) {
		const ref = dependency.ref;
		for (const dependant of dependency.dependsOn ?? []) {
			if (!graph.hasDirectedEdge(ref, dependant)) {
				graph.addDirectedEdge(ref, dependant);
			} else {
				console.warn(`Duplicate dependency from ${ref} to ${dependant} detected.`);
			}
		}
	}
}

function addRoot(graph: Graph, component: Component | undefined): void {
	if (component) {
		graph.addNode(component['bom-ref'], { label: component.name });
	}
}

export function createGraphFromBom(bom: Bom): Graph {
	// Create a new directed graph
	const graph = new Graph({ type: 'directed' });

	addRoot(graph, bom.metadata?.component);
	addNodes(graph, bom.components);
	addEdges(graph, bom.dependencies);

	// Use dagre to compute the layout
	computeLayoutWithDagre(graph);

	return graph;
}

/**
 * Function to compute the layout using dagre and assign positions to graph nodes
 * @param graph - The graphology graph
 */
function computeLayoutWithDagre(graph: Graph) {
	// Create a new directed graph for dagre
	const g = new dagre.graphlib.Graph();

	// Set graph options
	g.setGraph({
		rankdir: 'BT', // Direction: Top to Bottom (can be 'TB', 'BT', 'LR', 'RL')
		nodesep: 20, // Separation between nodes
		ranksep: 150, // Separation between ranks
		marginx: 20, // Horizontal margin
		marginy: 20 // Vertical margin
	});

	// Set default edge label properties (required by dagre)
	g.setDefaultEdgeLabel(() => ({}));

	// Add nodes to the dagre graph
	graph.forEachNode((node, attributes) => {
		const width = attributes.size * 2 || 20;
		const height = attributes.size * 2 || 20;
		g.setNode(node, { width, height });
	});

	// Add edges to the dagre graph
	graph.forEachEdge((edge, attributes, source, target) => {
		g.setEdge(source, target);
	});

	// Compute the layout
	dagre.layout(g);

	// Assign computed positions back to graphology nodes
	g.nodes().forEach((node) => {
		const nodeData = g.node(node);
		graph.mergeNodeAttributes(node, {
			x: nodeData.x,
			y: nodeData.y
		});
	});
}
