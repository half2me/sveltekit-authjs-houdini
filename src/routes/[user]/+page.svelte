<script lang="ts">
	import type { PageData } from './$houdini';

	export let data: PageData;

	$: ({ User } = data);
</script>

<p><a href="/">Go Back</a></p>

{#if !$User.fetching}
	{#if $User.errors}
		{#each $User.errors as e}
			Error: {e.message}
		{/each}
	{:else}
		Success! User's name is: {$User.data?.getUser?.name}
	{/if}
{/if}
