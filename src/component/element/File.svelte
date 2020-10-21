<script>
    
    // =================================================
    import { createEventDispatcher } from 'svelte';
    const shell = require('electron').shell;
    const fs = require('fs');
    const path = require('path');

    const dispatch = createEventDispatcher();
    function stepInto(fileName) {
        let fullName = path.normalize(workingDirectory + path.sep + fileName);
        if (fileName.endsWith('.lnk')) {
            fileName = shell.readShortcutLink(fullName).target;
            dispatch('jumpInto', {
                dir: fileName,
            });

            return;
        }
        if (fullName.startsWith('\\') || fs.lstatSync(fullName).isDirectory()) {
            dispatch('stepInto', {
			    dir: fileName,
            });
            
            return;
        }

        shell.openPath(fullName).then((result) => { console.log(result)});
        return;
    }
    // =================================================

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

</style>