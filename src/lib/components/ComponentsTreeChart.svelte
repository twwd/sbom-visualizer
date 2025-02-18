<script lang="ts">
	import { TreeChart, type TreeChartOptions } from '@carbon/charts-svelte';
	import '@carbon/charts-svelte/styles.css';
	import type { Bom } from '$lib/cyclonedx/models';
	import type { TreeChartItem } from '$lib/models/tree';

	let { bom, nodes = [] }: { bom: Bom; nodes: TreeChartItem[] } = $props();

	let treeOptions: TreeChartOptions = $state({});

	$effect.pre(() => {
		treeOptions = {
			title: 'Dependency Tree',
			height: `${(bom.components?.length ?? 10) * 15}px`,
			tree: {
				rootTitle: bom.metadata?.component?.name
			}
		};
	});
</script>

<TreeChart data={nodes} options={treeOptions} />
