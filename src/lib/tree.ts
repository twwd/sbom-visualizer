import type { ChartTabularData } from '@carbon/charts-svelte';
import type { Bom, Component } from '$lib/cyclonedx/models';

interface TreeItem {
	name: string;
	value?: string;
	children?: TreeItem[];
}

export function createTreeFromBom(bom: Bom): ChartTabularData {
	const componentMap = new Map<string, Component>();
	const dependencyMap = new Map<string, string[]>();

	const data: ChartTabularData = [];

	for (const component of bom.components ?? []) {
		if (component['bom-ref']) {
			componentMap.set(component['bom-ref'], component);
		}
	}

	for (const dependency of bom.dependencies ?? []) {
		dependencyMap.set(dependency.ref, dependency.dependsOn ?? []);
	}

	const subject = bom.metadata?.component;

	function getChildren(component: Component) {
		return (component['bom-ref'] ? (dependencyMap.get(component['bom-ref']) ?? []) : [])
			.map((child) => {
				const childComponent = componentMap.get(child);
				if (childComponent) {
					return getTreeItem(childComponent);
				} else {
					return null;
				}
			})
			.filter((child) => child !== null);
	}

	const getTreeItem: (component: Component) => TreeItem = (component: Component) => {
		return {
			name: component.name,
			value: component['bom-ref'] ?? null,
			children: getChildren(component)
		} as TreeItem;
	};

	if (subject) {
		data.push(...getChildren(subject));
	} else {
		console.error(`No subject found in ${bom.metadata}`);
	}

	return data;
}
