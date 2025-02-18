<script lang="ts">
	import type { Bom } from '$lib/cyclonedx/models';
	import ComponentsTable from '$lib/components/ComponentsTable.svelte';
	import ComponentsTreeView from '$lib/components/ComponentsTreeView.svelte';
	import { Button, Tab, TabContent, Tabs, Tile } from 'carbon-components-svelte';
	import ComponentsTreeChart from '$lib/components/ComponentsTreeChart.svelte';
	import ComponentModal from '$lib/components/ComponentModal.svelte';
	import { Document } from 'carbon-icons-svelte';
	import { createTreeDataFromBom, type TreeItem } from '$lib/tree';

	let { bom = null }: { bom: Bom | null } = $props();

	let subjectComponentModalOpened = $state(false);

	let selectedComponentRefInTreeView: string | undefined = $state();

	function searchComponentInTreeView(id: string) {
		selectedComponentRefInTreeView = id;
	}

	let treeData: TreeItem[] | undefined = $derived.by(() => {
		if (bom) {
			return createTreeDataFromBom(bom);
		}
	});
</script>

{#if bom}
	{#if bom.metadata?.component}
		<section class="tile">
			<Tile>
				<div class="tile__content">
					<p>
						SBOM for <strong>{bom.metadata.component.name}</strong>
					</p>
					<Button
						size="small"
						icon={Document}
						iconDescription="Show details"
						kind="primary"
						on:click={() => (subjectComponentModalOpened = true)}
					/>
				</div>
			</Tile>
		</section>
		<ComponentModal component={subjectComponentModalOpened ? bom.metadata.component : undefined} />
	{/if}
	{#if bom.components}
		<section class="tabs">
			<Tabs>
				<Tab label="Table" />
				<Tab label="Chart" />
				<svelte:fragment slot="content">
					<TabContent>
						{#if treeData}
							<div class="treeview">
								<ComponentsTreeView
									nodes={treeData}
									selectedComponentRef={selectedComponentRefInTreeView}
								/>
							</div>
						{/if}
						<div class="table">
							<ComponentsTable
								components={bom.components}
								searchComponent={searchComponentInTreeView}
							/>
						</div>
					</TabContent>
					<TabContent>
						{#if treeData}
							<ComponentsTreeChart {bom} nodes={treeData} />
						{/if}
					</TabContent>
				</svelte:fragment>
			</Tabs>
		</section>
	{/if}
{/if}

<style lang="scss">
	@use '@carbon/layout';

	.tile__content {
		display: flex;
		align-items: center;
		gap: layout.$spacing-03;
	}

	.tile {
		margin-bottom: layout.$spacing-07;
	}

	.treeview {
		margin-bottom: layout.$spacing-07;
	}
</style>
