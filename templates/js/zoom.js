class Zoom {
    constructor() {
        this.svg = document.getElementsByTagName('svg')[0];
        this.naturalWidth = this.svg.getBBox().width;
        this.naturalHeight = this.svg.getBBox().height;

        this.img = document.getElementById("images");
        this.imgContainer = document.getElementById("image-container");
        this.iconToggle = document.getElementById("icon-toggle");

        let resetZoom = () => {
            this.reset();
        }
        let onclick = e => {
            if (e.button == 0) {
                let scale = 1 + (e.altKey ? -0.2 : 0.2);
                this.smoothZomm(this.status.zoom * scale, this.getMousePointer(e.clientX, e.clientY));
            } else if (e.button == 1) {
                if (this.isImageExpanded())
                    resetZoom();
                else
                    this.smoothZomm(100, this.getMousePointer(e.clientX, e.clientY));
            }
        }
        let ondblclick = e => {
            if (this.isImageExpanded())
                resetZoom();
            else
                this.smoothZomm(100, this.getMousePointer(e.clientX, e.clientY));
        }
        addClickEvent(this.imgContainer, onclick);
        document.getElementById("btnZoomIn").addEventListener("click", () => {
            this.smoothZomm(this.status.zoom * 1.2, this.getWindowCenterMousePointer());
        });
        document.getElementById("btnZoomOut").addEventListener("click", () => {
            this.smoothZomm(this.status.zoom / 1.2, this.getWindowCenterMousePointer());
        });
        document.getElementById("btnZoomToggle").addEventListener("click", () => {
            if (this.isImageExpanded()) {
                resetZoom();
            } else
                this.smoothZomm(100, this.getWindowCenterMousePointer());
        });
        document.body.addEventListener("mousewheel", e => {
            // console.log(event.ctrlKey, event.wheelDeltaX, event.wheelDeltaY);
            // scroll to zoom, or ctrl key pressed scroll
            if (event.ctrlKey) {
                // ctrlKey == true: pinch
                let delta = event.ctrlKey ? event.wheelDelta / 120 : event.wheelDelta / 60;
                let mouseAt = this.getMousePointer(e.clientX, e.clientY);
                // zoom level increase / decrease by 30% for each wheel scroll
                this.pointZoom(this.status.zoom * (delta / 50 + 1), mouseAt);
                if (event.preventDefault) event.preventDefault();
                return false;
            }
        });
        window.addEventListener("scroll", () => {
            this.status.x = document.body.scrollLeft;
            this.status.y = document.body.scrollTop;
            this.calcSnap();
            saveStatus();
        });
        this.reset();
    }
    reset() {
        this.pointZoom(0);
        this.calcSnap();
    }
    calcSnap() {
        this.status.snapLeft = Math.abs(this.status.x) < 5;
        this.status.snapTop = Math.abs(this.status.y) < 5;
        this.status.snapRight = Math.abs(
            this.status.imgWidth + this.status.blankLeft + this.status.blankRight -
            this.status.x - window.innerWidth
        ) < 5;
        this.status.snapBottom = Math.abs(
            this.status.imgHeight + this.status.blankBottom + this.status.blankTop -
            this.status.y - window.innerHeight
        ) < 5;
    }
    smoothZomm(to, mouseAt, callback, ...args) {
        let winWidth = window.innerWidth;
        let minWidth = winWidth < this.naturalWidth ? winWidth : this.naturalWidth;
        let minZoom = minWidth / this.naturalWidth * 100;
        if (to < minZoom) to = minZoom;
        let from = this.status.zoom;
        if (from == to) return;
        const interval = 10;
        const level = 10;
        const delta = (to - from) / level;
        for (let i = 1; i <= level; i++) {
            setTimeout(() => {
                // console.log("before zoom:", this.img.x, this.img.y, document.body.scrollLeft, document.body.scrollTop);
                if (this.pointZoom(from + delta * i, mouseAt) && callback) callback(...args);
            }, interval * i);
        }
    }
    rectZoom(start, end) {
        let winWidth = window.innerWidth;
        let winHeight = window.innerHeight;
        let minWidth = winWidth < this.naturalWidth ? winWidth : this.naturalWidth;
        let minZoom = minWidth / this.naturalWidth * 100;
        const maxZoom = 100;

        let status = this.getRectZoomStatus(start, end);
        if (status.zoom < minZoom) status.zoom = minZoom;

        this.applyStatus(status);
    }
    pointZoom(zoom, point) {
        let winWidth = window.innerWidth;
        let winHeight = window.innerHeight;
        let minWidth = winWidth < this.naturalWidth ? winWidth : this.naturalWidth;
        let minZoom = minWidth / this.naturalWidth * 100;
        const maxZoom = 100;

        if (!point) point = this.getWindowCenterMousePointer();
        if (zoom < minZoom + 0.1) {
            // if zoom <= minZoom, reset
            zoom = minZoom;
            let imgHeight = this.naturalHeight * zoom / 100;
            point = this.getWindowCenterMousePointer();
            point.imageX = 0.5;
            if (imgHeight < window.innerHeight) {
                point.imageY = 0.5;
            } else {
                point.y = 0;
                point.imageY = 0;
            }
        }

        let status = this.getPointZoomStatus(zoom, point);
        this.applyStatus(status);
        return true;
    }
    getRectZoomStatus(start, end) {
        let startPoint = this.getMousePointer(start.x, start.y);
        let endPoint = this.getMousePointer(end.x, end.y);
        let imgSelCenterX = startPoint.imageX + (endPoint.imageX - startPoint.imageX) / 2;
        let imgSelCenterY = startPoint.imageY + (endPoint.imageY - startPoint.imageY) / 2;
        let imgX = (endPoint.imageX - startPoint.imageX) * this.svg.clientWidth;
        let imgY = (endPoint.imageY - startPoint.imageY) * this.svg.clientHeight;
        let scaleX = window.innerWidth / imgX;
        let scaleY = window.innerHeight / imgY;
        let scale = Math.min(scaleX, scaleY);
        let zoom = this.status.zoom * scale;
        let point = this.getWindowCenterMousePointer();
        point.imageX = imgSelCenterX;
        point.imageY = imgSelCenterY;
        return this.getPointZoomStatus(zoom, point);
    }
    getPointZoomStatus(zoom, point) {
        let imgWidth = this.naturalWidth * zoom / 100;
        let imgHeight = this.naturalHeight * zoom / 100;

        let blankRight = Math.floor(window.innerWidth - imgWidth * (1 - point.imageX) - point.x);
        let blankLeft = Math.floor(point.x - imgWidth * point.imageX);
        let blankBottom = Math.floor(window.innerHeight - imgHeight * (1 - point.imageY) - point.y);
        let blankTop = Math.floor(point.y - imgHeight * point.imageY);
        blankRight = blankRight < 0 ? 0 : blankRight;
        blankLeft = blankLeft < 0 ? 0 : blankLeft;
        blankBottom = blankBottom < 0 ? 0 : blankBottom;
        blankTop = blankTop < 0 ? 0 : blankTop;

        let status = {};
        status.imgWidth = imgWidth;
        status.imgHeight = imgHeight;
        status.blankTop = blankTop;
        status.blankRight = blankRight;
        status.blankBottom = blankBottom;
        status.blankLeft = blankLeft;
        status.x = Math.floor(imgWidth * point.imageX + status.blankLeft - point.x);
        status.y = Math.floor(imgHeight * point.imageY + status.blankTop - point.y);
        status.zoom = zoom
        return status;
    }
    applyStatus(status) {
        // console.log("apply status:", status);
        let imgWidth = this.naturalWidth * status.zoom / 100;
        let imgHeight = this.naturalHeight * status.zoom / 100;
        // update image size of saved status, since image may updated
        status.imgWidth = imgWidth;
        status.imgHeight = imgHeight;

        this.img.setAttribute("width", imgWidth);
        this.img.setAttribute("height", imgHeight);
        this.svg.setAttribute("width", `${imgWidth}pt`);
        this.svg.setAttribute("height", `${imgHeight}pt`);
        document.body.width = imgWidth
        document.body.height = imgHeight

        if (status.snapLeft === status.snapRight)
            // snapLeft & snapLeft all true => image width small than window, no snap
            // snapLeft & snapLeft all false => of course no snap
            document.body.scrollLeft = status.x;
        else if (status.snapLeft)
            document.body.scrollLeft = 0;
        else if (status.snapRight)
            document.body.scrollLeft = imgWidth + status.blankLeft + status.blankRight;

        if (status.snapTop === status.snapBottom)
            // snapLeft & snapLeft all true => image height small than window, no snap
            // snapLeft & snapLeft all false => of course no snap
            document.body.scrollTop = status.y;
        else if (status.snapTop)
            document.body.scrollTop = 0;
        else if (status.snapBottom)
            document.body.scrollTop = imgHeight + status.blankTop + status.blankBottom;

        this.status = status;
        this.setToggleIcon();
    }
    getMousePointer(x, y) {
        return {
            x: x,
            y: y,
            imageX: (x + document.body.scrollLeft - this.svg.getBBox().x) / this.svg.clientWidth,
            imageY: (y + document.body.scrollTop - this.svg.getBBox().y) / this.svg.clientHeight,
        }
    }
    getWindowCenterMousePointer() {
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        return this.getMousePointer(x, y);
    }
    setToggleIcon() {
        if (this.svg.clientWidth >= this.naturalWidth || document.body.scrollLeft != 0 || document.body.scrollTop != 0) {
            this.iconToggle.innerText = "fullscreen_exit";
        } else {
            this.iconToggle.innerText = "fullscreen";
        }
    }
    isImageExpanded() {
        return this.iconToggle.innerText == "fullscreen_exit";
    }
}