<script lang="ts">
	import type { Bom } from '$lib/cyclonedx/models';
	import { type ChartTabularData, TreeChart, type TreeChartOptions } from '@carbon/charts-svelte';
	import { createTreeFromBom } from '$lib/tree';
	import '@carbon/charts-svelte/styles.css';

	let { bom }: { bom: Bom } = $props();

	let treeData: ChartTabularData = $state([]);

	let treeOptions: TreeChartOptions = $state({});

	$effect.pre(() => {
		treeOptions = {
			title: 'Dependency Tree',
			height: `${(bom.components?.length ?? 100) * 15}px`,
			tree: {
				rootTitle: bom.metadata?.component?.name
			}
		};

		treeData = createTreeFromBom(bom);
	});
</script>

<TreeChart data={treeData} options={treeOptions} />
