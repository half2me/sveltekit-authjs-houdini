import { handle as handleAuth } from '$lib/server/auth';
import { setSession } from '$houdini';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const houdiniHandle: Handle = async ({ event, resolve }) => {
	const r = await event.fetch('/auth/session');
	setSession(event, { ...(await r.json()), set_by_backend: new Date() });
	let res = await resolve(event);
	return res;
};

export const handle = sequence(handleAuth, houdiniHandle);
