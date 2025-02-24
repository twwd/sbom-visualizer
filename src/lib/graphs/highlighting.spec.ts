import type { TreeChartState } from '$lib/models/treechart';
import { describe, expect, test } from 'vitest';
import { isInterestingNode } from './highlighting';

describe('isInterestingNode', () => {
	test('returns true when there is no highlighted node in hovered and selected', () => {
		const treeChartState: TreeChartState = {
			hovered: {},
			selected: {}
		};
		expect(isInterestingNode(treeChartState, 'node1')).toBe(true);
	});

	test('returns true when node is the targetNode in hovered state', () => {
		const treeChartState: TreeChartState = {
			hovered: {
				targetNode: 'node1'
			},
			selected: {}
		};
		expect(isInterestingNode(treeChartState, 'node1')).toBe(true);
	});

	test('returns true when node is in highlightedNodes in hovered state', () => {
		const treeChartState: TreeChartState = {
			hovered: {
				targetNode: 'node1',
				highlightedNodes: new Set(['node1', 'node2'])
			},
			selected: {}
		};
		expect(isInterestingNode(treeChartState, 'node2')).toBe(true);
	});

	test('returns false when node is not highlighted and there is a targetNode in hovered state', () => {
		const treeChartState: TreeChartState = {
			hovered: {
				targetNode: 'node1'
			},
			selected: {}
		};
		expect(isInterestingNode(treeChartState, 'node3')).toBe(false);
	});

	test('returns true when node is the targetNode in selected state', () => {
		const treeChartState: TreeChartState = {
			hovered: {},
			selected: {
				targetNode: 'node1'
			}
		};
		expect(isInterestingNode(treeChartState, 'node1')).toBe(true);
	});

	test('returns true when node is in highlightedNodes in selected state', () => {
		const treeChartState: TreeChartState = {
			hovered: {},
			selected: {
				targetNode: 'node1',
				highlightedNodes: new Set(['node1', 'node2'])
			}
		};
		expect(isInterestingNode(treeChartState, 'node2')).toBe(true);
	});

	test('returns false when node is not highlighted and there is a targetNode in selected state', () => {
		const treeChartState: TreeChartState = {
			hovered: {},
			selected: {
				targetNode: 'node1'
			}
		};
		expect(isInterestingNode(treeChartState, 'node3')).toBe(false);
	});

	test('returns true when node is highlighted in either hovered or selected state', () => {
		const treeChartState: TreeChartState = {
			hovered: {
				targetNode: 'node1',
				highlightedNodes: new Set(['node1', 'node2'])
			},
			selected: {
				targetNode: 'node3',
				highlightedNodes: new Set(['node3', 'node4'])
			}
		};
		expect(isInterestingNode(treeChartState, 'node2')).toBe(true); // node2 is highlighted in hovered
		expect(isInterestingNode(treeChartState, 'node4')).toBe(true); // node4 is highlighted in selected
	});

	test('returns false when node is not highlighted in either state', () => {
		const treeChartState: TreeChartState = {
			hovered: {
				targetNode: 'node1',
				highlightedNodes: new Set(['node1', 'node2'])
			},
			selected: {
				targetNode: 'node3',
				highlightedNodes: new Set(['node3', 'node4'])
			}
		};
		expect(isInterestingNode(treeChartState, 'node5')).toBe(false);
	});

	test('returns true when there is no targetNode but highlightedNodes contain the node', () => {
		const treeChartState: TreeChartState = {
			hovered: {
				highlightedNodes: new Set(['node1', 'node2'])
			},
			selected: {}
		};
		expect(isInterestingNode(treeChartState, 'node1')).toBe(true);
	});

	test('returns true when there is no targetNode and node is not in highlightedNodes', () => {
		const treeChartState: TreeChartState = {
			hovered: {
				highlightedNodes: new Set(['node1', 'node2'])
			},
			selected: {}
		};
		expect(isInterestingNode(treeChartState, 'node3')).toBe(true);
	});

	test('returns true when both hovered and selected have targetNode and node is highlighted in one', () => {
		const treeChartState: TreeChartState = {
			hovered: {
				targetNode: 'node1',
				highlightedNodes: new Set(['node1', 'node2'])
			},
			selected: {
				targetNode: 'node3',
				highlightedNodes: new Set(['node3', 'node4'])
			}
		};
		expect(isInterestingNode(treeChartState, 'node2')).toBe(true);
		expect(isInterestingNode(treeChartState, 'node5')).toBe(false);
	});
});
