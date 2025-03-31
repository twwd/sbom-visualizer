<script lang="ts">
	import type { AbstractGraph } from 'graphology-types';
	import ComponentsTreeChart from '$lib/components/ComponentsTreeChart.svelte';

	let {
		graph,
		selectedComponentRef,
		searchForComponent
	}: {
		graph: AbstractGraph | null;
		selectedComponentRef?: string;
		searchForComponent: (ref: string) => void;
	} = $props();
</script>

<h2>Dependency Graph</h2>

<p>
	<em>Double click a node to locate it in the dependency table.</em>
</p>

<ComponentsTreeChart {graph} {selectedComponentRef} {searchForComponent} />

<style lang="scss">
	@use '@carbon/layout';

	h2 {
		margin-bottom: layout.$spacing-05;
	}

	p {
		margin-bottom: layout.$spacing-05;
	}
</style>
