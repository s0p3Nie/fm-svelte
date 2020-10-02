<script>
	import WindowButtons from './component/composite/WindowButtons.svelte';
	import NavigationBlock from '~/component/block/NavigationBlock.svelte';
	import File from './component/element/File.svelte';
	import { Walker as FSWalker } from './service/fs/walker';
	import { FileSystemService as FSService } from './service/fs/fsmain';

	let walker = new FSWalker();
	const fsService = new FSService(walker); 
	$: fileList = [];
	refreshFileList();

	function stepInto(event) {
		walker.stepInto(event.detail.dir);
		refreshFileList();
	}

	function refreshFileList() {
		fsService.getPathContents(walker.getCurrentPosition()).then(res => { fileList = res });
	}
</script>  

<main> 
	<WindowButtons />
	
	<NavigationBlock fsWalker={walker} on:navigate-success={refreshFileList} />
	
	{#each fileList as file }
		<File on:stepInto={stepInto} fileName={file}/>
	{/each }
</main>

<style global type="text/scss">
	// importing all library as global style for lazy access in child components
    @import "../public/scss/surface_styles.scss";
</style>
  