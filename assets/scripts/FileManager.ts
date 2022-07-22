/** 文件操作管理类 */

import { assetManager, error, ImageAsset, instantiate, log, Node, Sprite, SpriteFrame, sys, Texture2D, Vec3 } from "cc";
import { Canvas2Image } from "./Canvas2Image";

 
// 读取文件方式
export enum READ_FILE_TYPE {
    DATA_URL,// readAsDataURL, base64
    TEXT,// readAsText
    BINARY,// readAsBinaryString
    ARRAYBUFFER,// readAsArrayBuffer
}
 
class FileMgr{
    private static instance : FileMgr;
    public static getInstance(): FileMgr{
        if(!FileMgr.instance){
            FileMgr.instance = new FileMgr();
        }
        return FileMgr.instance;
    }
 
    /**
     * 打开文件选择器
     *
     * @param {string} accept
     * @param {(file: File) => void} callback
     * @memberof FileMgr
     */
    openLocalFile(accept: string = ".*", callback: (file: File) => void) {
        let inputEl: HTMLInputElement = <HTMLInputElement>document.getElementById('file_input');
        if (!inputEl) {
            inputEl = document.createElement('input');
            inputEl.id = 'file_input';
            inputEl.setAttribute('id', 'file_input');
            inputEl.setAttribute('type', 'file');
            inputEl.setAttribute('class', 'fileToUpload');
            inputEl.style.opacity = '0';
            inputEl.style.position = 'absolute';
            inputEl.setAttribute('left', '-999px');
            document.body.appendChild(inputEl);
        }
 
        inputEl.setAttribute('accept', accept);

        inputEl.onchange = (event) => {
            let files = inputEl.files
            if (files && files.length > 0) {
                var file = files[0];
                if (callback) callback(file);
            }
        }

        inputEl.click();
    }
 
    /**
     * 读取本地文件数据
     *
     * @param {File} file
     * @param {READ_FILE_TYPE} readType
     * @param {((result: string | ArrayBuffer) => void)} callback
     * @memberof FileMgr
     */
    readLocalFile(file: File, readType: READ_FILE_TYPE, callback: (result: string | ArrayBuffer) => void) {
        var reader = new FileReader();
        reader.onload = function (event) {
            if (callback) {
                if (reader.readyState == FileReader.DONE) {
                    // console.log('xxx FileReader', event, reader.result);
                    callback(reader.result);
                } else {
                    callback(null);
                }
            }
        };
        switch (readType) {
            case READ_FILE_TYPE.DATA_URL:
                reader.readAsDataURL(file);
                break;
            case READ_FILE_TYPE.TEXT:
                reader.readAsText(file);   //作为字符串读出
                //reader.readAsText(file,'gb2312');   //默认是用utf-8格式输出的，想指定输出格式就再添加一个参数，像txt的ANSI格式只能用国标才能显示出来
                break;
            case READ_FILE_TYPE.BINARY:
                reader.readAsBinaryString(file);
                break;
            case READ_FILE_TYPE.ARRAYBUFFER:
                reader.readAsArrayBuffer(file);
                break;
        }
    }
   
    /**
     * 保存数据到本地
     *
     * @param {*} textToWrite       要保存的文件内容
     * @param {*} fileNameToSaveAs  要保存的文件名
     * @param {*} fileType  MIME types 文件类型,例如:image/png 或者 application/json
     * @memberof FileMgr
     */
    saveForBrowser(textToWrite:any, fileNameToSaveAs:string,fileType:string='application/json') {    
        if (sys.isBrowser) {        
            console.log("浏览器");        
            let textFileAsBlob = new Blob([textToWrite], {type:fileType});        
            let downloadLink = document.createElement("a");        
            downloadLink.download = fileNameToSaveAs;        
            downloadLink.innerHTML = "Download File";        
            if (window.webkitURL != null){            
                // Chrome allows the link to be clicked            
                // without actually adding it to the DOM.            
                downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);        
            }else{            
                // Firefox requires the link to be added to the DOM            
                // before it can be clicked.            
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);            
                // downloadLink.onclick = destroyClickedElement;            
                downloadLink.style.display = "none";            
                document.body.appendChild(downloadLink);        
            }        
                
            downloadLink.click();    
        } 
    }


    savaAsImage(width:number, height:number, arrayBuffer:Uint8Array,type:string='.jpg',fileName:string='default',nateveTestSaveNode?:Node){
        let _canvas:HTMLCanvasElement = null;
        if (sys.isBrowser) {
            if (!_canvas) {
                _canvas = document.createElement('canvas');
                _canvas.width = width;
                _canvas.height = height;
            } else {
                this.clearCanvas(_canvas);
            }
            let ctx = _canvas.getContext('2d',{'alpha':true,'colorSpace':"display-p3"})!;
            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let sRow = height - 1 - row;
                let imageData = ctx.createImageData(width, 1,{'colorSpace':"display-p3"});
                let start = sRow * width * 4;
                for (let i = 0; i < rowBytes; i++) {
                    imageData.data[i] = arrayBuffer[start + i];
                }
                ctx.putImageData(imageData, 0, row);
            }
            //@ts-ignore
            const canvas2image = Canvas2Image.getInstance();
            canvas2image && canvas2image.saveAsImage(_canvas, width, height,type,fileName);
        } else if (sys.isNative) {
            // console.log("原生平台暂不支持图片下载");
            // return;
            let filePath = jsb.fileUtils.getWritablePath() + 'render_to_sprite_image.png';

            // 目前 3.0.0 ~ 3.4.0 版本还不支持 jsb.saveImageData ,引擎计划在 3.5.0 支持, 要保存 imageData 为本地 png 文件需要参考下方的 pr 定制引擎
            // https://gitee.com/zzf2019/engine-native/commit/1ddb6ec9627a8320cd3545d353d8861da33282a8

            //@ts-ignore
            if (jsb.saveImageData) {
                //@ts-ignore
                let success = jsb.saveImageData(this._buffer, width, height, filePath);
                if (success && nateveTestSaveNode) {
                    // 用于测试图片是否正确保存到本地设备路径下
                    assetManager.loadRemote<ImageAsset>(filePath, (err, imageAsset)=> {
                        if (err) {
                            console.log("show image error")
                        } else {
                            let newNode = instantiate(nateveTestSaveNode);
                            newNode.setPosition(new Vec3(-newNode.position.x, newNode.position.y, newNode.position.z));
                            nateveTestSaveNode.parent.addChild(newNode);
                            
                            const spriteFrame = new SpriteFrame();
                            const texture = new Texture2D();
                            texture.image = imageAsset;
                            spriteFrame.texture = texture;
                            newNode.getComponent(Sprite).spriteFrame = spriteFrame;
                            spriteFrame.packable = false;
                            spriteFrame.flipUVY = true;
                            if (sys.isNative && (sys.os === sys.OS.IOS || sys.os === sys.OS.OSX)) {
                                spriteFrame.flipUVY = false;
                            }
    
                            // this.tips.string = `成功保存在设备目录并加载成功: ${filePath}`;
                        }
                    });
                    log("save image data success, file: " + filePath);
                    // this.tips.string = `成功保存在设备目录: ${filePath}`;
                }
                else {
                    error("save image data failed!");
                    // this.tips.string = `保存图片失败`;
                }
            }
        } else if (sys.platform === sys.Platform.WECHAT_GAME) {
            if (!_canvas) {
                //@ts-ignore
                _canvas = wx.createCanvas();
                _canvas.width = width;
                _canvas.height = height;
            } else {
                this.clearCanvas(_canvas);
            }
            let ctx = _canvas.getContext('2d');

            let rowBytes = width * 4;

            for (let row = 0; row < height; row++) {
                let sRow = height - 1 - row;
                let imageData = ctx.createImageData(width, 1);
                let start = sRow * width * 4;

                for (let i = 0; i < rowBytes; i++) {
                    imageData.data[i] = arrayBuffer[start + i];
                }

                ctx.putImageData(imageData, 0, row);
            }
            //@ts-ignore
            _canvas.toTempFilePath({
                x: 0,
                y: 0,
                width: _canvas.width,
                height: _canvas.height,
                destWidth: _canvas.width,
                destHeight: _canvas.height,
                fileType: "png",
                success: (res) =>{
                    //@ts-ignore
                    wx.showToast({
                        title: "截图成功"
                    });
                    //@ts-ignore
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: (res)=> {
                            //@ts-ignore              
                            wx.showToast({
                                title: "成功保存到设备相册",
                            });
                            // `成功保存在设备目录: ${res.tempFilePath}`;
                        },
                        fail: ()=> {
                            // `保存图片失败`;
                        }
                    })
                },
                fail: ()=> {
                    //@ts-ignore
                    wx.showToast({
                        title: "截图失败"
                    });
                }
            })
        }
    }

    private clearCanvas(canvas) {
        let ctx = canvas.getContext('2d',{'alpha':true,'colorSpace':"display-p3"});
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

export let fileMgr:FileMgr = (()=>{
    return FileMgr.getInstance();
})();