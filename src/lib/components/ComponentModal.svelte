<script lang="ts">
	import type { Component } from '$lib/cyclonedx/models';
	import ComponentInfo from '$lib/components/ComponentInfo.svelte';
	import { CodeSnippet, Modal } from 'carbon-components-svelte';
	import { ComponentModalContent } from '$lib/components/ComponentModalContent';

	let { component }: { component?: Component } = $props();

	let componentModalContent = $derived(new ComponentModalContent(component));
	let componentModelIsOpen: boolean = $state(false);

	$effect(() => {
		if (component) {
			componentModelIsOpen = true;
		}
	});
</script>

<Modal bind:open={componentModelIsOpen} passiveModal modalHeading={componentModalContent.heading}>
	{#if componentModalContent.component}
		<ComponentInfo component={componentModalContent.component} />
		<CodeSnippet type="multi" code={componentModalContent.code} expanded />
	{/if}
</Modal>
