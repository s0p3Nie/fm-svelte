<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

	function stepInto(fileName) {
		dispatch('stepInto', {
			dir: fileName,
		});
	}

    export let fileName;
</script>

<div class="row card" on:click={stepInto(fileName)}>
    {fileName}
</div>

<style>
    .row {
        width: 100%;
    }
</style>