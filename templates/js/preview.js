let zoomer;
let sendStatus;

function saveStatus() {
    if (sendStatus) {
        let status = JSON.stringify(zoomer.status);
        // console.log("save status: " + status);
        sendStatus.attributes["href"].value = 'command:erd-preview.previewStatus?' + encodeURIComponent(status);
        sendStatus.click();
    }
}

window.addEventListener("load", () => {
    let status = undefined;
    try {
        status = JSON.parse(document.getElementById("status").innerHTML);
    } catch (error) {
        // console.log("parse preview status error:", error.message);
        status = undefined;
    }

    sendStatus = document.getElementById("sendStatus");

    zoomer = new Zoom();

    if (status) {
        zoomer.applyStatus(status);
    }
});

window.addEventListener(
    "resize",
    (function () {
        let onResizeAvailable = false;
        setTimeout(() => {
            onResizeAvailable = true;
        }, 300);
        return function (e) {
            if (!onResizeAvailable) {
                // block unwanted resize event triggered when page initializes.
                // console.log("rejected resize event.");
                return;
            }
            zoomer.reset();
        }
    })()
);