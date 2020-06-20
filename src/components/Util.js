export const dataURItoFile = (dataURI) => {
    // Format of a base64-encoded URL:
    // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAAEOCAIAAAAPH1dAAAAK
    var BASE64_MARKER = ';base64,';
    var mime = dataURI.split(BASE64_MARKER)[0].split(':')[1];
    var filename = 'dataURI-file-' + (new Date()).getTime() + '.' + mime.split('/')[1];
    var bytes = atob(dataURI.split(BASE64_MARKER)[1]);
    var writer = new Uint8Array(new ArrayBuffer(bytes.length));
    for (var i=0; i < bytes.length; i++) {
      writer[i] = bytes.charCodeAt(i);
    }
    return new File([writer.buffer], filename, { type: mime });
}

export const dataURItoBlob = (dataURI) => {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}
