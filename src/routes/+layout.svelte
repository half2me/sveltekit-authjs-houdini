<script lang="ts">
	import type { LayoutData } from './$types';
	import { onMount, onDestroy } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { validFor } from '$lib/util';
	import { signIn, signOut } from '@auth/sveltekit/client';

	export let data: LayoutData;

	let secsLeft = 0;

	// Auth stuff:
	let authTimeout: any;
	let authInterval: any;
	onMount(() => {
		if (data.session?.expires_at) {
			// schedule this for automatic token refresh when it expires
			authTimeout = setTimeout(
				() => invalidate('/auth/session'),
				validFor(data.session?.expires_at)
			);

			// auto update secsLeft to show current token validity
			authInterval = setInterval(() => {
				secsLeft = Math.round(validFor(data.session.expires_at) / 1000);
			}, 500);
		}
	});

	onDestroy(() => {
		clearTimeout(authTimeout);
		clearInterval(authInterval);
	});
</script>

{#if data.session.user}
	<p>
		Hello {data.session.user.email}! Your token is valid for {secsLeft} secs.
		<button on:click={signOut}> Logout </button>
	</p>
	<textarea rows="4" cols="50">{data.session.access_token}</textarea>
	<br />
	<slot />
{:else}
	<p>You must be logged in to view this page</p>
	<button on:click={() => signIn('cognito')}> Login </button>
{/if}
