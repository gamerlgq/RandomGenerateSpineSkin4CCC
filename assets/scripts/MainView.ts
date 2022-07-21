import { _decorator, Component, Node, sp, Camera, RenderTexture, view, SpriteFrame, Sprite, Size, sys, assetManager, ImageAsset, Texture2D, UITransform, v3 } from 'cc';
import { fileMgr } from './FileManager';
const { ccclass, property } = _decorator;

@ccclass('MainView')
export class MainView extends Component {

    @property(sp.Skeleton)
    spine:sp.Skeleton = null;

    @property(Camera)
    captureCamera:Camera = null;

    @property(Sprite)
    testCapture:Sprite = null;

    private _renderTexutre:RenderTexture = null;

    private _width:number = null;
    private _height:number = null;
    private _size:Size = null;
    private _buffer:Uint8Array = null;

    private targetNode:Node = null;
    private copyNode:Node = null;

    start() {
        this.targetNode = this.spine.node;
        this.copyNode = this.testCapture.node;
        const size = view.getVisibleSize();
        this._renderTexutre = new RenderTexture();
        this._size = size;
        this._renderTexutre.reset({
            width: this._size.width,
            height: this._size.height,
        })
        this.captureCamera.enabled = true;
        this.captureCamera.targetTexture = this._renderTexutre;
    }
    
    captureScreen(fileName:string){
        this._capture(fileName);
    }

    private _capture(fileName:string) {
        this.copyRenderTex(this.targetNode);
        this.showImage(this._width, this._height);
        this.scheduleOnce(()=>{
            this.copyRenderTex(this.copyNode,true);
            fileMgr.savaAsImage(Math.round(this._width),Math.round(this._height),this._buffer,'jpg',fileName);
            this.targetNode.active = true;
            this.copyNode.active = false;
            console.log(assetManager.assets);
        },0.1)
    }

    copyRenderTex(targetNode:Node,isSaveImage:boolean=false) {
        let width = targetNode.getComponent(UITransform).width;
        let height = targetNode.getComponent(UITransform).height;
        let worldPos = targetNode.getWorldPosition();
        const nodeScale = targetNode.getScale();

        this._width = width * nodeScale.x;
        this._height = height * nodeScale.y;
        const x = isSaveImage ? Math.round(worldPos.x) : Math.round(worldPos.x - this._width/2);
        const y = Math.round(worldPos.y);
        this._buffer = this._renderTexutre.readPixels(x, y, this._width, this._height); 
    }

    showImage(width:number, height:number) {
        const spriteFrame = this.copyNode!.getComponent(Sprite).spriteFrame;
        spriteFrame.texture.destroy();

        let img = new ImageAsset();
        img.reset({
            _data: this._buffer,
            width: width,
            height: height,
            format: Texture2D.PixelFormat.RGBA8888,
            _compressed: false
        });
        let texture = new Texture2D();
        texture.image = img;

        let sf = new SpriteFrame();
        sf.texture = texture;
        sf.packable = false;

        this.copyNode!.getComponent(Sprite).spriteFrame = sf;
        this.copyNode!.getComponent(Sprite).spriteFrame.flipUVY = true;
                
        if (sys.isNative && (sys.os === sys.OS.IOS || sys.os === sys.OS.OSX)) {
            this.copyNode!.getComponent(Sprite).spriteFrame.flipUVY = false;
        }
        this.copyNode?.getComponent(UITransform)?.setContentSize(new Size(width, height));
        this.copyNode.active = true;
        this.copyNode.position = v3(0-width/2,0-height/2,0);
        this.targetNode.active = false;
    }
}