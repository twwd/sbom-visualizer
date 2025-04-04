<script lang="ts">
	import type { Bom, Component } from '$lib/cyclonedx/models';
	import ComponentsTable from '$lib/components/ComponentsTable.svelte';
	import { Button, Tab, TabContent, Tabs, Tile } from 'carbon-components-svelte';
	import ComponentModal from '$lib/components/ComponentModal.svelte';
	import { Document } from 'carbon-icons-svelte';
	import Graph from 'graphology';
	import type { AbstractGraph } from 'graphology-types';
	import { onDestroy } from 'svelte';
	import { TreeGenerationWorkerWrapper } from '$lib/worker/GraphWorkerWrapper';
	import GlobalComponentsTreeChart from '$lib/components/GlobalComponentsTreeChart.svelte';

	let { bom = null }: { bom: Bom | null } = $props();

	let graph: AbstractGraph | null = $state(null);

	const treeGenerationWorkerWrapper = new TreeGenerationWorkerWrapper((g: Graph) => {
		graph = g;
	});

	let selectedComponentForModal: Component | undefined = $state();
	let selectedComponentRefInTreeGraph: string | undefined = $state();
	let searchValueInTable: string = $state('');

	function searchComponentInTreeGraph(id: string) {
		selectedTabIndex = 1; // Switch to graph tab
		selectedComponentRefInTreeGraph = id;
	}

	function showComponentModal(component?: Component) {
		selectedComponentForModal = component;
	}

	function searchForComponentInTable(ref: string) {
		selectedTabIndex = 0; // Switch to table tab
		searchValueInTable = ref;
	}

	let selectedTabIndex: number = $state(0); // for lazy-loading the chart

	let showGraph: boolean = $state(false);

	onDestroy(() => {
		treeGenerationWorkerWrapper?.terminate();
	});

	$effect(() => {
		if (bom) {
			treeGenerationWorkerWrapper.sendMessage(bom);
		}
	});

	$effect(() => {
		if (selectedTabIndex === 1) {
			showGraph = true;
		}
	});
</script>

{#if bom}
	{#if bom.metadata?.component}
		<section class="subject-tile">
			<Tile>
				<div class="subject-tile__content">
					<p>
						SBOM for <strong>{bom.metadata.component.name}</strong>
					</p>
					<Button
						size="small"
						icon={Document}
						iconDescription="Show details"
						kind="primary"
						on:click={() => showComponentModal(bom.metadata?.component)}
					/>
				</div>
			</Tile>
		</section>
	{/if}
	{#if bom.components}
		<section class="tabs">
			<Tabs type="default" bind:selected={selectedTabIndex}>
				<Tab label="Table" />
				<Tab label="Chart" />
				<svelte:fragment slot="content">
					<TabContent>
						<div class="tab__tile">
							<ComponentsTable
								components={bom.components}
								{searchComponentInTreeGraph}
								showComponentDetails={showComponentModal}
								searchValue={searchValueInTable}
							/>
						</div>
					</TabContent>
					<TabContent>
						<div class="tab__tile">
							{#if showGraph}
								<GlobalComponentsTreeChart
									{graph}
									selectedComponentRef={selectedComponentRefInTreeGraph}
									searchForComponent={searchForComponentInTable}
								/>
							{/if}
						</div>
					</TabContent>
				</svelte:fragment>
			</Tabs>
		</section>
	{/if}
{/if}

<ComponentModal component={selectedComponentForModal} {graph} />

<style lang="scss">
	@use '@carbon/layout';
	@use '@carbon/styles/scss/theme';

	.subject-tile {
		margin-bottom: layout.$spacing-07;

		&__content {
			display: flex;
			align-items: center;
			gap: layout.$spacing-03;
		}
	}

	:global .bx--tab-content {
		background-color: theme.$layer-accent;
		padding-left: layout.$spacing-07;
		padding-right: layout.$spacing-07;
		margin-left: -2rem;
		margin-right: -2rem;
		margin-bottom: -2rem;
	}

	.tab__tile {
		background-color: theme.$layer;
		padding: layout.$spacing-05;
	}

	.tab__tile:first-of-type {
		margin-bottom: layout.$spacing-07;
	}
</style>
