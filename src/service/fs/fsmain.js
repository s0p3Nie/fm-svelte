import { fs } from '~/fs';
import { path } from '~/path';

/**
 * Main entry point for mostly all fileSystem operations
 */
export class FileSystemService {
    constructor(walker) {
        this.walker = walker;
    }

    getFileMetas(file) {
        return new Promise((resolve) => {
            fs.stat(this.walker.getCurrentPosition() + path.sep + file, (err, stats) => {
                if (err) {
                    resolve();
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

        return new Promise((resolve) => {
            fs.readdir(this.walker.getCurrentPosition(), (err, files) => {
                if (err) {
                    resolve();
                }
                resolve(files);
            });
        });
    }
}