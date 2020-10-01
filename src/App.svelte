<script>
	import WindowButtons from './component/composite/WindowButtons.svelte';
	import FileName from './component/element/FileName.svelte';
	import { Walker as FSWalker } from './service/fs/walker';
	import { FileSystemService as FSService } from './service/fs/fsmain';

	const walker = new FSWalker();
	const fsService = new FSService(walker); 
	let fileList = [];
	refreshFileList();

	function stepInto(event) {
		walker.stepInto(event.detail.dir);
		refreshFileList();
	}

	function refreshFileList() {
		fsService.getPathContents(walker.getCurrentPosition()).then(res => { fileList = res });
	}

	function logClick(event) {
		console.log(event);
	}
</script>  

<main> 
	<div on:keydown|preventDefault={logClick}>
	<WindowButtons />
	
	{#each fileList as file }
		<FileName on:stepInto={stepInto} fileName={file}/>
	{/each }
	</div>
</main>

<style global type="text/scss">
	// importing all library as global style for lazy access in child components
    @import "../public/scss/surface_styles.scss";
</style>
  