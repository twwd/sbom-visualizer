import type { Bom } from '$lib/cyclonedx/models';
import type { TreeNode } from 'carbon-components-svelte/src/TreeView/TreeView.svelte';

// Used for the tree chart
export interface TreeChartItem {
	name: string;
	value?: string;
	children?: TreeChartItem[];
}

// The combined type that can be used for the TreeView and the TreeChart
export type TreeItem = TreeChartItem & TreeNode;

class TreeItemImpl implements TreeItem {
	private readonly _name: string;
	private readonly _ref: string;
	private readonly _children: TreeItem[] | undefined;

	constructor(name: string, ref: string, children?: TreeItem[]) {
		this._name = name;
		this._ref = ref;
		this._children = children && children.length > 0 ? children : undefined;
	}

	get name() {
		return this._name;
	}

	get text() {
		return this._name;
	}

	get id() {
		return this._ref;
	}

	get value() {
		return this._ref;
	}

	get children() {
		return this._children;
	}

	get nodes() {
		return this._children;
	}

	get icon() {
		return undefined;
	}

	get disabled() {
		return undefined;
	}
}

export function createTreeDataFromBom(bom: Bom): TreeItem[] {
	const componentRefToName = new Map<string, string>();
	const dependencyMap = new Map<string, string[]>();

	const data: TreeItem[] = [];

	for (const component of bom.components ?? []) {
		if (component['bom-ref']) {
			componentRefToName.set(component['bom-ref'], component.name);
		}
	}

	for (const dependency of bom.dependencies ?? []) {
		dependencyMap.set(dependency.ref, dependency.dependsOn ?? []);
	}

	const subject = bom.metadata?.component;

	function getChildTreeItems(componentRef: string) {
		return (dependencyMap.get(componentRef) ?? [])
			.map((child) => {
				if (componentRefToName.has(child)) {
					return getTreeItem(child, componentRefToName.get(child)!);
				} else {
					return null;
				}
			})
			.filter((child) => child !== null);
	}

	const getTreeItem: (componentRef: string, componentName: string) => TreeItem = (
		componentRef,
		componentName
	) => {
		return new TreeItemImpl(componentName, componentRef, getChildTreeItems(componentRef));
	};

	if (subject && subject['bom-ref']) {
		data.push(...getChildTreeItems(subject['bom-ref']));
	} else {
		console.error(`No subject found in ${bom.metadata}`);
	}

	return data;
}
