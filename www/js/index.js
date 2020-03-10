function getPicture() {

    navigator.camera.getPicture(onSuccess, onFail, {

        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI
    });

    function onSuccess(imageData) {
        camera.images.push(imageData);
        fileName = imageData.substr(imageData.lastIndexOf("/") + 1, imageData.length);
        var img = "<img src='" + imageData + "'>";
        document.getElementById("imgContainer").innerHTML(img);
        console.log(camera.images);
    }

    function onFail(message) {
        // something went wrong
    }

}

function uploadAll() {
    console.log("Ok, going to upload " + camera.images.length + "");
    var defs = [];
    camera.images.forEach(function (i, index) {
        console.log('processing ' + i);
        var def = $.Deferred();
        var uri = encodeURI(main.server_path + "uploadImages.php");

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = i.substr(i.lastIndexOf('/') + 1);
        options.mimeType = "image / jpeg";
        options.params = { index: index };

        var ft = new FileTransfer();
        ft.upload(i, uri, win, fail, options);
        defs.push(def.promise());

        function win(r) {
            console.log("upload done");
            console.log(r);
            if ($.trim(r.response) === "0") {
                console.log("this one failed");
                def.resolve(0);
            } else {
                console.log("this one passed");
                def.resolve(1);
            }
        }

        function fail(error) {
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
            def.resolve(0);
        }

    });


    $.when.apply($, defs).then(function () {
        console.log("All images updated");
        console.log(arguments);
    });
}