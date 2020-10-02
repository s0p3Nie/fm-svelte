import { fs } from '~/fs';
import { path } from '~/path';
import { BaseContainer } from '~/types/containers';
  
export class Walker { 

    constructor(startPath) {
        // В будущем надо будет соблюдать предел контенера, ЖС начинает жестоко тупить с большими массивами
        const stackLimit = 5000;
        
        if (startPath && fs.existsSync(startPath) && fs.lstatSync(startPath).isDirectory()) {
            this.currentPath = startPath; 
        } else {
            this.currentPath = process.env.USERPROFILE;
        }
        this.undoContainer = new BaseContainer();
        this.redoContainer = new BaseContainer();
    }

    stepInto(directory) {
        const currentPathBefore = path.normalize(this.currentPath);
        const gotoDirectory = path.normalize(this.currentPath + path.sep + directory);
        if (fs.existsSync(gotoDirectory) && fs.lstatSync(gotoDirectory).isDirectory()) {
            this.currentPath = gotoDirectory;
        }
        if (currentPathBefore !== this.currentPath) {
            this.undoContainer.add(currentPathBefore);
            this.redoContainer.clear();
        }
        console.log(this.currentPath);
    }

    stepBackwards() {
        const currentPathBefore = path.normalize(this.currentPath);
        const gotoDirectory = path.normalize(this.currentPath + path.sep + '..');
        if (fs.existsSync(gotoDirectory) && fs.lstatSync(gotoDirectory).isDirectory()) {
            this.currentPath = gotoDirectory;
        }
        if (currentPathBefore !== this.currentPath) {
            this.undoContainer.add(currentPathBefore);
            this.redoContainer.clear();
        }
    }

    jumpTo(directory) {
        const currentPathBefore = path.normalize(this.currentPath);
        const gotoDirectory = path.normalize(directory);
        if (fs.existsSync(gotoDirectory) && fs.lstatSync(gotoDirectory).isDirectory()) {
            this.currentPath = gotoDirectory;
        }
        if (currentPathBefore !== this.currentPath) {
            this.undoContainer.add(currentPathBefore);
            this.redoContainer.clear();
        }
        return this.currentPath;
    }

    stepUndo() {
        const currentPathBefore = path.normalize(this.currentPath);
        if (!this.undoContainer.isEmpty()) {
            const undoPath = path.normalize(this.undoContainer.get());
            if (currentPathBefore !== undoPath) {
                this.redoContainer.add(currentPathBefore);
                this.currentPath = undoPath;
            }
        }
    }

    stepRedo() {
        const currentPathBefore = path.normalize(this.currentPath);
        if (!this.redoContainer.isEmpty()) {
            const redoPath = path.normalize(this.redoContainer.get());
            if (currentPathBefore !== redoPath) {
                this.undoContainer.add(currentPathBefore);
                this.currentPath = redoPath;
            }
        }
    }

    getCurrentPosition() {
        return path.normalize(this.currentPath);
    }

    getContainer(type) {
        if (type == 'redo') {
            return this.redoContainer;
        }
        if (type == 'undo') {
            return this.undoContainer;
        }
    }
}
