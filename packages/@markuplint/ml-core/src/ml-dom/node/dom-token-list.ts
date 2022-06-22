import type { MLAttr } from './attr';
import type { RuleInfo } from '@markuplint/ml-config';

import { getCol, getLine } from '@markuplint/parser-utils';

import UnexpectedCallError from './unexpected-call-error';

type Scope = {
	raw: string;
	startOffset: number;
	startLine: number;
	startCol: number;
	rule: RuleInfo<any, any>;
};

export class MLDomTokenList extends Array<string> implements DOMTokenList {
	#set: Set<string>;
	#origin: string;
	/**
	 * In some cases, an author specifies multiple attributes or directives.
	 * The reference is not always one.
	 */
	#ownerAttrs: MLAttr<any, any>[];

	get value() {
		return this.join(' ');
	}

	constructor(tokens: string, ownerAttrs: MLAttr<any, any>[]) {
		const list = tokens
			.split(/\s+/)
			.map(t => t.trim())
			.filter(t => !!t);
		super(...list);
		this.#origin = tokens;
		this.#ownerAttrs = ownerAttrs;
		this.#set = new Set(list);
	}

	add(...tokens: string[]): void {
		for (const token of tokens) {
			if (this.#set.has(token)) {
				continue;
			}
			this.#set.add(token);
			this.push(token);
		}
		this.#origin += tokens.join(' ');
	}

	/**
	 * @implements `@markuplint/ml-core` API: `MLDomTokenList`
	 */
	allTokens() {
		let offset = 0;
		const tokens = Array.from(this);
		const locs: Scope[] = [];
		while (tokens.length) {
			const token = tokens.shift();
			if (!token) {
				break;
			}
			const loc = this._pick(token, offset);
			if (!loc) {
				offset = 0;
				continue;
			}
			offset = loc._searchedIndex;
			locs.push({
				raw: loc.raw,
				startOffset: loc.startOffset,
				startLine: loc.startLine,
				startCol: loc.startCol,
				rule: loc.rule,
			});
		}
		return locs;
	}

	contains(token: string): boolean {
		return this.#set.has(token);
	}

	forEach(callbackfn: (value: string, index: number, parent: any) => void, thisArg?: any): void {
		this.forEach.bind(this)((v, i) => callbackfn(v, i, thisArg ?? this));
	}

	item(index: number): string | null {
		return this[index] ?? null;
	}

	/**
	 * @implements `@markuplint/ml-core` API: `MLDomTokenList`
	 */
	pick(token: string): Scope | null {
		const r = this._pick(token);
		if (!r) {
			return null;
		}
		return {
			raw: r.raw,
			startOffset: r.startOffset,
			startLine: r.startLine,
			startCol: r.startCol,
			rule: r.rule,
		};
	}

	remove(...tokens: string[]): void {
		throw new UnexpectedCallError('Not supported "remove" method');
	}

	replace(token: string, newToken: string): boolean {
		throw new UnexpectedCallError('Not supported "replace" method');
	}

	supports(token: string): boolean {
		throw new UnexpectedCallError('Not supported "supports" method');
	}

	toggle(token: string, force?: boolean): boolean {
		throw new UnexpectedCallError('Not supported "toggle" method');
	}

	toString(): string {
		return this.value;
	}

	private _pick(token: string, _offset = 0): (Scope & { _searchedIndex: number }) | null {
		token = token.trim().split(/\s+/g)[0];
		if (!token) {
			return null;
		}

		for (const ownerAttr of this.#ownerAttrs) {
			if (ownerAttr.isDynamicValue) {
				continue;
			}
			const startOffset = this.#origin.indexOf(token, _offset);
			if (startOffset === -1) {
				continue;
			}
			const startLine = getLine(this.#origin, startOffset);
			const startCol = getCol(this.#origin, startOffset);

			return {
				raw: token,
				startOffset: (ownerAttr.valueNode?.startOffset ?? 0) + startOffset,
				startLine: (ownerAttr.valueNode?.startLine ?? 0) + (startLine - 1),
				startCol: (ownerAttr.valueNode?.startCol ?? 0) + (startCol - 1),
				rule: ownerAttr.rule,
				_searchedIndex: startOffset,
			};
		}

		return null;
	}
}
