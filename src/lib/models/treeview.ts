// Used for the tree chart
import type { TreeNode } from 'carbon-components-svelte/src/TreeView/TreeView.svelte';

// The combined type that can be used for the TreeView and the TreeChart
export type TreeItem = TreeNode;

export class TreeItemImpl implements TreeItem {
	private readonly _name: string;
	private readonly _ref: string;
	private readonly _children: TreeItem[] | undefined;

	constructor(name: string, ref: string, children?: TreeItem[]) {
		this._name = name;
		this._ref = ref;
		this._children = children && children.length > 0 ? children : undefined;
	}

	get text() {
		return this._name;
	}

	get id() {
		return this._ref;
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
