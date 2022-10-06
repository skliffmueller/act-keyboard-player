type imageLoadCallbackProps = { baseImage: Image, charImage: Image};
type onImageLoadCallback = (imgObj: imageLoadCallbackProps) => void;
export class GLCharSprites {
    canvas: HTMLCanvasElement;
    cts: CanvasRenderingContext2D;
    baseImage: Image | HTMLImage;
    charImage: Image | HTMLImage;
    constructor(baseImage: Image | HTMLImage, charImage: Image | HTMLImage) {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.baseImage = baseImage;
        this.charImage = charImage;

        this.canvas.width = baseImage.width;
        this.canvas.height = baseImage.height;
    }
    getImageData(image: Image | HTMLImage, width: number, height: number): ImageData {
        this.canvas.width = width;
        this.canvas.height = height;

        this.ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

        return this.ctx.getImageData(0, 0, width, height);

    }
    setCharMapCords(rows:number, cols:number, width:number, height:number, charList:string): void { // 7, 10, 26, 26
        // charList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()[]/{}|;':\",.\\<>?-=_+"
        this.charMapCords = {};
        this.charWidth = width;
        this.charHeight = height;
        charList.split("").forEach((char, charIndex) => {
            const x = charIndex % cols;
            const y = (charIndex - x) / cols;
            this.charMapCords[char] = [x * width,y * height];
        });
    }
    createBaseWithString(xCenter:number, yCenter:number, str:string, baseImageWidth:number, baseImageHeight:number): ImageData {
        const baseWidth = baseImageWidth || this.baseImage.width;
        const baseHeight = baseImageHeight || this.baseImage.height;
        const strWidth = str.length * this.charWidth;
        const strHeight = this.charHeight;
        const xAbsolute = xCenter - (strWidth/2);
        const yAbsolute = yCenter - (strHeight/2);

        const baseImageData = this.getImageData(this.baseImage, baseWidth, baseHeight);
        const charImageData = this.getImageData(this.charImage, this.charImage.width, this.charImage.height);

        str.split("").forEach((char, cIndex) => {
            const [xSrc, ySrc] = this.charMapCords[char];
            for(let y = ySrc; y < (ySrc + this.charHeight);y++) {
                for(let x = xSrc; x < (xSrc + this.charWidth);x++) {
                    const charIndex = (x + y * charImageData.width);
                    if(charImageData.data[charIndex * 4 + 0] === 255
                        && charImageData.data[charIndex * 4 + 1] === 255
                        && charImageData.data[charIndex * 4 + 2] === 255) {
                        const baseIndex = (xAbsolute + (x - xSrc) + (cIndex * this.charWidth))
                            + ((yAbsolute + y - ySrc) * baseImageData.width);
                        baseImageData.data[baseIndex * 4 + 0] = 255; // r
                        baseImageData.data[baseIndex * 4 + 1] = 255; // g
                        baseImageData.data[baseIndex * 4 + 2] = 255; // b
                        baseImageData.data[baseIndex * 4 + 3] = 255; // a
                    }
                }
            }
        });
        this.canvas.width = baseImageData.width;
        this.canvas.height = baseImageData.height;

        this.ctx.putImageData(baseImageData, 0, 0);

        return this.ctx.getImageData(0,0,baseImageData.width, baseImageData.height);
    }

    static onImageLoad(baseUrl: string, charUrl: string, callback: onImageLoadCallback):void {
        const baseImage = new Image();
        const charImage = new Image();
        let counter = 0;
        const onLoad = () => {
            counter++;
            if(counter === 2) {
                callback({ baseImage, charImage });
            }
        };
        baseImage.onload = onLoad;
        charImage.onload = onLoad;
        baseImage.src = baseUrl;
        charImage.src = charUrl;
    }
}
