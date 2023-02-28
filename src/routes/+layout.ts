import type { LayoutLoad } from './$types';
import { setClientSession } from '$houdini';
import { setAccessToken } from '$lib/util';

export const prerender = false;

export const load: LayoutLoad = async ({ url, fetch }) => {
	const r = await fetch('/auth/session');
	const res = await r.json();
	setAccessToken(res.access_token);
	return { session: res };
};
