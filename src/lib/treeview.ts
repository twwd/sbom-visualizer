import type { Bom, Component } from '$lib/cyclonedx/models';
import type { TreeNode } from 'carbon-components-svelte/src/TreeView/TreeView.svelte';

export function createTreeNodesFromBom(bom: Bom): TreeNode[] {
	// const componentMap = new Map<string, Component>();
	const componentRefToName = new Map<string, string>();
	const dependencyMap = new Map<string, string[]>();

	const data: TreeNode[] = [];

	for (const component of bom.components ?? []) {
		if (component['bom-ref']) {
			//componentMap.set(component['bom-ref'], component);
			componentRefToName.set(component['bom-ref'], component.name);
		}
	}

	for (const dependency of bom.dependencies ?? []) {
		dependencyMap.set(dependency.ref, dependency.dependsOn ?? []);
	}

	const subject = bom.metadata?.component;

	function getChildNodes(componentRef: string) {
		return (dependencyMap.get(componentRef) ?? [])
			.map((child) => {
				if (componentRefToName.has(child)) {
					return getTreeNode(child, componentRefToName.get(child)!);
				} else {
					return null;
				}
			})
			.filter((child) => child !== null);
	}

	const getTreeNode: (componentRef: string, componentName: string) => TreeNode = (
		componentRef,
		componentName
	) => {
		const childNodes = getChildNodes(componentRef);
		return {
			text: componentName,
			id: componentRef,
			nodes: childNodes.length > 0 ? childNodes : null
		} as TreeNode;
	};

	if (subject && subject['bom-ref']) {
		data.push(...getChildNodes(subject['bom-ref']));
	} else {
		console.error(`No subject found in ${bom.metadata}`);
	}

	return data;
}
