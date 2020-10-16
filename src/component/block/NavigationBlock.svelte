<script>
    import BackButton from '~/component/element/button/BackButton.svelte';
    import ForwardButton from '~/component/element/button/ForwardButton.svelte';
    import BackwardsButton from '~/component/element/button/BackwardsButton.svelte';
    import GoToInput from '~/component/element/input/GoToInput.svelte';
    import { createEventDispatcher } from 'svelte';

    export let fsWalker;

    const dispatch = createEventDispatcher();    

    $: currentPosition = fsWalker.getCurrentPosition();
    $: backContainerEmpty = fsWalker.getContainer('undo').isEmpty();
    $: forwContainerEmpty = fsWalker.getContainer('redo').isEmpty();

    function back() {
        fsWalker.stepUndo();
        navigateSuccess();
    }
    function forward() {
        fsWalker.stepRedo();
        navigateSuccess();
    }
    function backwards() {
        fsWalker.stepBackwards();
        navigateSuccess();
    }
    function jumpTo(event) {
        // if enter
        if (13 === event.keyCode) {
            let result = fsWalker.jumpTo(this.value);
            this.value = result;
            navigateSuccess();
        }
    }
    export function navigateSuccess() {
        currentPosition = fsWalker.getCurrentPosition();
        backContainerEmpty = fsWalker.getContainer('undo').isEmpty();
        forwContainerEmpty = fsWalker.getContainer('redo').isEmpty();

        dispatch('navigate-success');
    }

</script>

<div>
    <span>
        <span on:click={back}>
            <BackButton empty={backContainerEmpty}/>
        </span>
        <span on:click={forward}>
            <ForwardButton empty={forwContainerEmpty}/>
        </span>
        <span on:click={backwards}>
            <BackwardsButton/>
        </span>
        <span>
            <GoToInput goToDirectory={currentPosition} keyup={jumpTo}/>    
        </span>
    </span>
</div>