<script>
    export let goToDirectory;
    export let keyup;
</script>

<span>
    <input bind:value={goToDirectory} on:keyup={keyup}>
</span>