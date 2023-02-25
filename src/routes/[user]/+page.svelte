<script lang="ts">
	import type { PageData } from './$houdini';

	export let data: PageData;

	$: ({ User } = data);
</script>

{#if !$User.fetching}
	We got the name: {$User.data?.getUser?.name}
{/if}
