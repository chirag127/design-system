import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@chirag127/keyless-opencode-zen', () => ({ chat: vi.fn() }));
vi.mock('@chirag127/keyless-kilo', () => ({ chat: vi.fn() }));
vi.mock('@chirag127/keyless-ovh', () => ({ chat: vi.fn() }));
vi.mock('@chirag127/keyless-pollinations', () => ({ chat: vi.fn() }));

import { chat as zen } from '@chirag127/keyless-opencode-zen';
import { chat as kilo } from '@chirag127/keyless-kilo';
import { chat as ovh } from '@chirag127/keyless-ovh';
import { chat as pollinations } from '@chirag127/keyless-pollinations';
import { chat, listProviders, DEFAULT_ORDER } from '../src/index.js';

beforeEach(() => {
	vi.clearAllMocks();
	delete process.env.KEYLESS_ORDER;
});

describe('keyless-ai', () => {
	it('lists all 4 providers', () => {
		expect(listProviders()).toEqual(['opencode-zen', 'kilo', 'ovh', 'pollinations']);
		expect(DEFAULT_ORDER).toEqual(['opencode-zen', 'kilo', 'ovh', 'pollinations']);
	});

	it('returns first success (zen) without trying others', async () => {
		zen.mockResolvedValue('from-zen');
		const out = await chat('hi');
		expect(out).toBe('from-zen');
		expect(zen).toHaveBeenCalledOnce();
		expect(kilo).not.toHaveBeenCalled();
		expect(ovh).not.toHaveBeenCalled();
		expect(pollinations).not.toHaveBeenCalled();
	});

	it('falls through to the next provider on failure', async () => {
		zen.mockRejectedValue(new Error('402'));
		kilo.mockResolvedValue('from-kilo');
		const out = await chat('hi');
		expect(out).toBe('from-kilo');
		expect(zen).toHaveBeenCalledOnce();
		expect(kilo).toHaveBeenCalledOnce();
		expect(ovh).not.toHaveBeenCalled();
	});

	it('passes messages + opts through to the provider, strips order/onError', async () => {
		zen.mockResolvedValue('ok');
		const onError = vi.fn();
		await chat([{ role: 'user', content: 'q' }], { model: 'x', temperature: 0.2, order: undefined, onError });
		const [msgs, opts] = zen.mock.calls[0];
		expect(msgs).toEqual([{ role: 'user', content: 'q' }]);
		expect(opts).toEqual({ model: 'x', temperature: 0.2 });
		expect(opts).not.toHaveProperty('order');
		expect(opts).not.toHaveProperty('onError');
	});

	it('respects opts.order override', async () => {
		ovh.mockResolvedValue('from-ovh');
		const out = await chat('hi', { order: ['ovh', 'zen'] });
		expect(out).toBe('from-ovh');
		expect(ovh).toHaveBeenCalledOnce();
		expect(zen).not.toHaveBeenCalled();
	});

	it('respects env KEYLESS_ORDER', async () => {
		process.env.KEYLESS_ORDER = 'kilo, pollinations';
		pollinations.mockResolvedValue('from-poll');
		kilo.mockRejectedValue(new Error('boom'));
		const out = await chat('hi');
		expect(out).toBe('from-poll');
		expect(kilo).toHaveBeenCalledOnce();
		expect(pollinations).toHaveBeenCalledOnce();
		expect(zen).not.toHaveBeenCalled();
	});

	it('invokes onError for each failed provider', async () => {
		zen.mockRejectedValue(new Error('e1'));
		kilo.mockResolvedValue('ok');
		const onError = vi.fn();
		await chat('hi', { onError });
		expect(onError).toHaveBeenCalledOnce();
		expect(onError).toHaveBeenCalledWith('opencode-zen', expect.any(Error));
	});

	it('throws AggregateError only when ALL providers fail', async () => {
		zen.mockRejectedValue(new Error('e1'));
		kilo.mockRejectedValue(new Error('e2'));
		ovh.mockRejectedValue(new Error('e3'));
		pollinations.mockRejectedValue(new Error('e4'));
		await expect(chat('hi')).rejects.toThrow(AggregateError);
		await expect(chat('hi')).rejects.toThrow(/All keyless providers failed/);
	});

	it('records unknown provider names as errors and skips them', async () => {
		zen.mockResolvedValue('ok');
		const out = await chat('hi', { order: ['nope', 'opencode-zen'] });
		expect(out).toBe('ok');
		expect(zen).toHaveBeenCalledOnce();
	});
});
