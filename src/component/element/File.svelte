<script>
    
    // =================================================
    import { createEventDispatcher } from 'svelte';
    const shell = require('electron').shell;

    const dispatch = createEventDispatcher();
    function stepInto(fileName) {
        if (fileName.endsWith('.lnk')) {
            let fullName = path.normalize(workingDirectory + path.sep + fileName);
            fileName = shell.readShortcutLink(fullName).target;
            dispatch('jumpInto', {
                dir: fileName,
            });
        }
		dispatch('stepInto', {
			dir: fileName,
		});
    }
    // =================================================

    import { fs } from '~/fs';
    import { path } from '~/path';
    export let fileName;
    export let workingDirectory;

    let size;
    /* not working %( */
    fs.stat(path.normalize(workingDirectory + path.sep + fileName), (err, stat) => {
        if (err) {
            console.log(err);
        }

        size = stat.size;
    });
    
</script>

<tr on:click={stepInto(fileName)}>
    <td>{fileName}</td>
    <td>smth</td>
    <td>123123</td>
</tr>

<style>
    .row {
        width: 100%;
    }
</style>