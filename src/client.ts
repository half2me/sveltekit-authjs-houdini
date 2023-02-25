import { HoudiniClient, getClientSession } from '$houdini';
import { PUBLIC_AWS_APPSYNC_ENDPOINT } from '$env/static/public';

const preferClientSession = () => ({
	start(ctx, { next }) {
		const cs = getClientSession();
		ctx.session = Object.keys(cs).length === 0 ? ctx.session : cs;
		next(ctx);
	}
});

export default new HoudiniClient({
	url: PUBLIC_AWS_APPSYNC_ENDPOINT,
	plugins: [preferClientSession],
	fetchParams({ session }) {
		if (session.access_token) {
			return { headers: { Authorization: session.access_token } };
		}
		return {};
	}
});
