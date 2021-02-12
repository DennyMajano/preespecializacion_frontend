class ExtFile {
    getExtension(filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
    }

    isImage(filename) {
        var ext = this.getExtension(filename);
        switch (ext.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'png':
                return true;

            default:

            //etc
        }
        return false;
    }

    isVideo(filename) {
        var ext = this.getExtension(filename);
        switch (ext.toLowerCase()) {
            case 'm4v':
            case 'avi':
            case 'mpg':
            case 'mp4':
            case 'wmv':
                return true;

            default:
            // etc
        }
        return false;
    }
    isDocument(filename) {
        var ext = this.getExtension(filename);
        switch (ext.toLowerCase()) {
            case 'pdf':
                return true;

            default:

            // etc
        }
        return false;
    }
    isHojaCalculo(filename) {
        var ext = this.getExtension(filename);
        switch (ext.toLowerCase()) {
            case 'csv':
                return true;
            case 'xlsx':
                return true;

            default:

            // etc
        }
        return false;
    }
}

export default new ExtFile()