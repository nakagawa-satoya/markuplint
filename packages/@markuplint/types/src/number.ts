import type { Result } from './types.js';
import type { Number } from './types.schema.js';

import { matched, unmatched } from './match-result.js';
import { isFloat, isInt } from './primitive/index.js';

export function checkNumber(value: string, type: Readonly<Number>, ref?: string): Result {
	if (!value) {
		return unmatched(value, 'empty-token');
	}
	const syntaxMatched = type.type === 'float' ? isFloat(value) : isInt(value);
	if (syntaxMatched) {
		const n = parseFloat(value);
		if (!isFinite(n)) {
			return unmatched(value, 'unexpected-token');
		}

		const clampable = type.clampable;
		const isInt = type.type === 'integer';

		if (type.gt != null && n <= type.gt) {
			return unmatched(value, 'out-of-range', {
				candidate: clampable && isInt ? `${type.gt + 1}` : undefined,
			});
		}

		if (type.gte != null && n < type.gte) {
			return unmatched(value, 'out-of-range', {
				candidate: clampable ? `${type.gte}` : undefined,
			});
		}

		if (type.lt != null && type.lt <= n) {
			return unmatched(value, 'out-of-range', {
				candidate: clampable && isInt ? `${type.lt - 1}` : undefined,
			});
		}

		if (type.lte != null && type.lte < n) {
			return unmatched(value, 'out-of-range', {
				candidate: clampable ? `${type.lte}` : undefined,
			});
		}
	}
	return syntaxMatched ? matched() : unmatched(value, 'unexpected-token');
}
