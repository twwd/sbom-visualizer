<script lang="ts">
	import '@carbon/charts-svelte/styles.css';
	import { Button, ButtonSet, TreeView } from 'carbon-components-svelte';
	import type { TreeNode } from 'carbon-components-svelte/src/TreeView/TreeView.svelte';
	import { CollapseAll, ExpandAll } from 'carbon-icons-svelte';

	let { nodes, selectedComponentRef }: { nodes: TreeNode[]; selectedComponentRef?: string } =
		$props();

	let treeview: TreeView | null = null;

	$effect(() => {
		if (selectedComponentRef) {
			treeview?.showNode(selectedComponentRef);
		}
	});
</script>

<h2>Dependency Tree</h2>

<div class="buttons">
	<ButtonSet>
		<Button size="small" kind="tertiary" on:click={() => treeview?.collapseAll()} icon={CollapseAll}
			>Collapse all
		</Button>
		<Button size="small" kind="tertiary" on:click={() => treeview?.expandAll()} icon={ExpandAll}
			>Expand all
		</Button>
	</ButtonSet>
</div>

<p>
	<em
		>Nodes with … at the end indicate that the maximum level of nesting is reached for this view.</em
	>
</p>

<TreeView bind:this={treeview} {nodes} />

<style lang="scss">
	@use '@carbon/layout';

	h2 {
		margin-bottom: layout.$spacing-05;
	}

	p {
		margin-bottom: layout.$spacing-02;
	}

	.buttons {
		margin-bottom: layout.$spacing-04;
	}
</style>
