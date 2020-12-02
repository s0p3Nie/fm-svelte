import { fs } from '../../fs';
import { path } from '../../path';
import type {Walker} from "./walker";

/**
 * Main entry point for mostly all fileSystem operations
 */
export class FileSystemService {
    private walker: Walker;

    constructor(walker) {
        this.walker = walker;
    }

    getFileMetas(file) {
        return new Promise((resolve, reject) => {
            fs.stat(this.walker.getCurrentPosition() + path.sep + file, (err, stats) => {
                if (err) {
                    reject(err);
                }
                resolve(stats);
            });
        });
    }

    getPathContents() {
        if (this.walker.rootPath === this.walker.getCurrentPosition()) {
            return new Promise(resolve => {
                resolve(this.walker.drivesHelper.getDriveList());
            })
        }

        return new Promise((resolve, reject) => {
            fs.readdir(this.walker.getCurrentPosition(), (err, files) => {
                if (err) {
                    reject(err);
                }
                resolve(files);
            });
        });
    }
}
