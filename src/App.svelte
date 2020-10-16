<script>
	import WindowButtons from './component/composite/WindowButtons.svelte';
	import NavigationBlock from '~/component/block/NavigationBlock.svelte';
	import File from './component/element/File.svelte';
	import { Walker as FSWalker } from './service/fs/walker';
	import { FileSystemService as FSService } from './service/fs/fsmain';

	const walker = new FSWalker();
	const fsService = new FSService(walker); 
	let navigationBlock;
	$: fileList = [];
	$: currentPosition = walker.getCurrentPosition();
	refreshFileList();

	function jumpInto(event) {
		if (walker.jumpTo(event.detail.dir)) {
			navigationBlock.navigateSuccess();
		}
	}
	function stepInto(event) {
		if (walker.stepInto(event.detail.dir)) {
			navigationBlock.navigateSuccess();
		}
	}

	function refreshFileList() {
		fsService.getPathContents(walker.getCurrentPosition()).then(res => { 
			fileList = res; 
			currentPosition = walker.getCurrentPosition() 
		});
	}
</script>  

<main> 
	<WindowButtons />
	
	<NavigationBlock bind:this={navigationBlock} fsWalker={walker} on:navigate-success={refreshFileList} />
	
	<table class='g--8 card'>
		<tr class='table-header'>
			<td>Имя</td>
			<td>Вес</td>
		</tr>
		{#each fileList as file }
			<File on:stepInto={stepInto} on:jumpInto={jumpInto} fileName={file} workingDirectory={currentPosition}/>
		{/each }
	</table>
</main>

<style global type="text/scss">
	// importing all library as global style for lazy access in child components
    @import "../public/scss/surface_styles.scss";
</style>
  