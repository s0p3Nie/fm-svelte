<script>
    export let empty;
</script>

<span>
    <button class='btn--float {empty ? 'btn--primary' : 'btn--blue'}' disabled='{empty}'>&lt;</button>
</span>

<style>
    button {
        color: aliceblue;
    }
</style>