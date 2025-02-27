import type { ChildNode, Result, Specs } from './types.js';
import type { Category } from '@markuplint/ml-spec';

import { contentModelCategoryToTagNames } from '@markuplint/ml-spec';

import { cmLog } from './debug.js';
import { cleanObject, matches } from './utils.js';

export type SelectorResult = Result<'UNMATCHED_SELECTOR_BUT_MAY_EMPTY' | 'MISSING_NODE' | 'UNMATCHED_SELECTORS'>;

type Condition = {
	selector: string;
	hasCustom: boolean;
	hasText: boolean;
};

export function matchesSelector(
	query: string,
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	node: ChildNode | undefined,
	specs: Specs,
	depth: number,
): SelectorResult {
	const nodeLog = cmLog.extend(`node#${depth}`);

	const { selector, hasText, hasCustom } = optCondition(query, specs);

	if (node == null) {
		if (hasText) {
			nodeLog('<#text>.matches(%s) => ""', query);
			return {
				type: 'MATCHED_ZERO',
				matched: [],
				unmatched: [],
				zeroMatch: true,
				query,
				hint: {},
			};
		}
		return {
			type: 'MISSING_NODE',
			matched: [],
			unmatched: [],
			zeroMatch: false,
			query,
			hint: {},
		};
	}

	if (node.is(node.TEXT_NODE)) {
		if (hasText) {
			nodeLog('<#text>.matches(%s) => "%s"', query, node.raw.trim());
			return {
				type: 'MATCHED',
				matched: [node],
				unmatched: [],
				zeroMatch: true,
				query,
				hint: {},
			};
		}

		if (node.isWhitespace()) {
			nodeLog('<#text>.matches(%s) => WHITESPACE', query);
			return {
				type: 'MATCHED',
				matched: [node],
				unmatched: [],
				zeroMatch: true,
				query,
				hint: {},
			};
		}

		// Disallows a text node
		return {
			type: 'UNEXPECTED_EXTRA_NODE',
			matched: [],
			unmatched: [node],
			zeroMatch: false,
			query,
			hint: {},
		};
	}

	if (node.is(node.MARKUPLINT_PREPROCESSOR_BLOCK)) {
		nodeLog('%s.matches(%s) => PBlock', node.raw, query);
		return {
			type: 'MATCHED',
			matched: [node],
			unmatched: [],
			zeroMatch: !!hasText,
			query,
			hint: {},
		};
	}

	if (node.is(node.ELEMENT_NODE)) {
		if (node.elementType !== 'html' && hasCustom) {
			nodeLog('%s.matches(%s) => CustomElement', node.raw, query);
			return {
				type: 'MATCHED',
				matched: [node],
				unmatched: [],
				zeroMatch: !!hasText,
				query,
				hint: {},
			};
		}

		const result = matches(selector, node, specs);
		nodeLog('%s.matches(%s) => %s', node.raw, query, result.matched);

		if (result.matched) {
			return {
				type: 'MATCHED',
				matched: [node],
				unmatched: [],
				zeroMatch: !!hasText,
				query,
				hint: {},
			};
		}

		if (hasText) {
			return {
				type: 'UNMATCHED_SELECTOR_BUT_MAY_EMPTY',
				matched: [],
				unmatched: [node],
				zeroMatch: true,
				query,
				hint: cleanObject({
					not: result.not,
				}),
			};
		}

		return {
			type: 'UNMATCHED_SELECTORS',
			matched: [],
			unmatched: [node],
			zeroMatch: false,
			query,
			hint: cleanObject({
				not: result.not,
			}),
		};
	}

	return {
		type: 'MATCHED',
		matched: [node],
		unmatched: [],
		zeroMatch: !!hasText,
		query,
		hint: {},
	};
}

const conditionWithoutSpecs: Record<string, Condition> = {
	'#custom': {
		selector: '#custom',
		hasCustom: true,
		hasText: false,
	},
	'#text': {
		selector: '#text',
		hasCustom: false,
		hasText: true,
	},
};
const optConditionSpecsBaseCaches = new Map<Specs, Map<string, Condition>>();
function optCondition(query: string, specs: Specs): Readonly<Condition> {
	const condWithoutSpecs = conditionWithoutSpecs[query];
	if (condWithoutSpecs) {
		return condWithoutSpecs;
	}

	const queryCaches = optConditionSpecsBaseCaches.get(specs) ?? new Map<string, Condition>();
	const cached = queryCaches.get(query);
	if (cached) {
		return cached;
	}

	let hasCustom = false;
	let hasText = false;

	const selector = query.replace(/^(?::model\(([^)]+)\)|#([a-z-]+))(.*)$/, (_, $model, _model, $last) => {
		const _selectors = contentModelCategoryToTagNames(`#${$model ?? _model}` as Category, specs.def);
		if (_selectors.length === 0) {
			throw new Error(`${$model ?? _model} is empty`);
		}

		const selectors: string[] = [];
		for (const selector of _selectors) {
			if (selector === '#custom') {
				hasCustom = true;
				continue;
			}
			if (selector === '#text') {
				hasText = true;
				continue;
			}
			selectors.push(selector);
		}

		return `:is(${selectors.join(',')})${$last ?? ''}`;
	});

	const result: Condition = {
		selector,
		hasCustom,
		hasText,
	};

	queryCaches.set(query, result);
	optConditionSpecsBaseCaches.set(specs, queryCaches);

	return result;
}
