<script lang="ts">
	import {
		Content,
		Header,
		HeaderGlobalAction,
		HeaderUtilities,
		Modal,
		SkipToContent,
		Theme
	} from 'carbon-components-svelte';
	import { SettingsAdjust } from 'carbon-icons-svelte';
	import 'carbon-components-svelte/css/all.css';

	let { children } = $props();

	let settingsOpen = $state(false);
</script>

<svelte:head>
	<title>SBOM Visualizer</title>
</svelte:head>

<Header platformName="SBOM Visualizer">
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<HeaderGlobalAction
			iconDescription="Settings"
			tooltipAlignment="end"
			icon={SettingsAdjust}
			on:click={() => (settingsOpen = true)}
		/>
	</HeaderUtilities>
</Header>

<Content>
	{@render children()}
</Content>

<Modal bind:open={settingsOpen} passiveModal modalHeading="Settings">
	<Theme render="toggle" persist persistKey="__carbon-theme" />
</Modal>
