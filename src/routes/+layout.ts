import type { LayoutLoad } from './$types';
import { setClientSession } from '$houdini';

export const prerender = false;

export const load: LayoutLoad = async ({ url, fetch }) => {
	const r = await fetch('/auth/session');
	const res = await r.json();
	setClientSession({ ...res, set_by_client: new Date() });
	return { session: res };
};
