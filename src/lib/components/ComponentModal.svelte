<script lang="ts">
	import type { Component } from '$lib/cyclonedx/models';
	import ComponentInfo from '$lib/components/ComponentInfo.svelte';
	import { CodeSnippet, Modal } from 'carbon-components-svelte';
	import { ComponentModalContent } from '$lib/components/ComponentModalContent';
	import type { AbstractGraph } from 'graphology-types';
	import { allSimplePaths } from 'graphology-simple-path';
	import { subgraph as generateSubgraph } from 'graphology-operators';
	import ComponentsTreeChart from '$lib/components/ComponentsTreeChart.svelte';
	import { getGraphRootNode } from '$lib/graphs/utils';

	let { component, graph }: { component?: Component; graph?: AbstractGraph | null } = $props();

	let componentModalContent = $derived(new ComponentModalContent(component));
	let componentModelIsOpen: boolean = $state(false);

	let subgraph: AbstractGraph | null | undefined = $derived.by(() => {
		if (graph && component) {
			const root = getGraphRootNode(graph);
			const paths = allSimplePaths(graph, root, component['bom-ref']);
			if (paths && paths.length > 0) {
				const interestingNodes = paths.reduce((p, c) => p.union(new Set(c)), new Set<string>());
				return generateSubgraph(graph, interestingNodes);
			}
			console.warn(`No useful subgraph found: ${paths.join(',')}`);

			return null;
		}
	});

	$effect(() => {
		if (component) {
			componentModelIsOpen = true;
		}
	});
</script>

<Modal bind:open={componentModelIsOpen} passiveModal modalHeading={componentModalContent.heading}>
	{#if componentModalContent.component}
		<ComponentInfo component={componentModalContent.component} />
		{#if !!subgraph}
			<h4>Dependency Graph</h4>
			<ComponentsTreeChart graph={subgraph} />
		{/if}
		<h4>Component JSON</h4>
		<CodeSnippet type="multi" code={componentModalContent.code} expanded />
	{/if}
</Modal>
