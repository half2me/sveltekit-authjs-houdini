import { HoudiniClient } from '$houdini';
import { PUBLIC_AWS_APPSYNC_ENDPOINT } from '$env/static/public';
import { getAccessToken } from '$lib/util';

export default new HoudiniClient({
	url: PUBLIC_AWS_APPSYNC_ENDPOINT,
	fetchParams({ session }) {
		const token = getAccessToken();
		if (token) {
			return { headers: { Authorization: token } };
		}
		return {};
	}
});
