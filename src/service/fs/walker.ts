//import {fs} from '../../fs';
import { fs }  from '../../fs';
import { path } from '../../path';
import { BaseContainer } from '../../types';
import { DrivesHelper } from '../../helpers/sys-folder-helper.js';

export class Walker {
    undoContainer: BaseContainer;
    redoContainer: BaseContainer;
    currentPath;
    drivesHelper;

    rootPath = '\\';

    constructor(startPath) {
        // В будущем надо будет соблюдать предел контенера, ЖС начинает жестоко тупить с большими массивами
        const stackLimit = 5000;

        if (startPath && fs.existsSync(startPath) && fs.lstatSync(startPath).isDirectory()) {
            this.currentPath = startPath;
        } else {
            this.currentPath = process.env.USERPROFILE;
        }
        this.undoContainer = new BaseContainer(stackLimit);
        this.redoContainer = new BaseContainer(stackLimit);
        this.drivesHelper = new DrivesHelper();
    }

    normalizePath(toNormalize) {
        const normalized = path.normalize(toNormalize);

        return normalized.startsWith(this.rootPath) && 1 < normalized.length
            ? normalized.substring(this.rootPath.length)
            : normalized;
    }

    checkDirectory(directory) {
        return this.rootPath === directory
            || (fs.existsSync(directory) && fs.lstatSync(directory).isDirectory());
    }

    stepInto(directory) {
        const currentPathBefore = this.normalizePath(this.currentPath);
        const gotoDirectory = this.normalizePath(
            this.currentPath
            + (this.rootPath === currentPathBefore ? '' : path.sep)
            + directory
        );
        if (this.checkDirectory(gotoDirectory)) {
            this.currentPath = gotoDirectory;
        }
        if (currentPathBefore !== this.currentPath) {
            this.undoContainer.add(currentPathBefore);
            this.redoContainer.clear();
            return true;
        }

        return false;
    }

    stepBackwards() {
        const currentPathBefore = this.normalizePath(this.currentPath);
        const gotoDirectory = this.drivesHelper.getDriveList().includes(currentPathBefore)
            ? this.rootPath
            : this.normalizePath(this.currentPath + path.sep + '..');

        if (this.checkDirectory(gotoDirectory)) {
            this.currentPath = gotoDirectory;
        }
        if (currentPathBefore !== this.currentPath) {
            this.undoContainer.add(currentPathBefore);
            this.redoContainer.clear();
        }
    }

    jumpTo(directory) {
        const currentPathBefore = this.normalizePath(this.currentPath);
        const gotoDirectory = this.normalizePath(directory);
        if (this.checkDirectory(gotoDirectory)) {
            this.currentPath = gotoDirectory;
        }
        if (currentPathBefore !== this.currentPath) {
            this.undoContainer.add(currentPathBefore);
            this.redoContainer.clear();
        }
        return this.currentPath;
    }

    stepUndo() {
        const currentPathBefore = this.normalizePath(this.currentPath);
        if (!this.undoContainer.isEmpty()) {
            const undoPath = this.normalizePath(this.undoContainer.get());
            if (currentPathBefore !== undoPath) {
                this.redoContainer.add(currentPathBefore);
                this.currentPath = undoPath;
            }
        }
    }

    stepRedo() {
        const currentPathBefore = this.normalizePath(this.currentPath);
        if (!this.redoContainer.isEmpty()) {
            const redoPath = this.normalizePath(this.redoContainer.get());
            if (currentPathBefore !== redoPath) {
                this.undoContainer.add(currentPathBefore);
                this.currentPath = redoPath;
            }
        }
    }

    getCurrentPosition() {
        return this.normalizePath(this.currentPath);
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
