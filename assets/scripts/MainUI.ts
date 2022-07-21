import { _decorator, Component, Node, EditBox, sp, v3, UITransform, size, Sprite, view, Label, tween, color, resources, JsonAsset, warn, error, assetManager } from 'cc';
import { MHData } from '../../declarations/MHData';
import { Canvas2Image } from './Canvas2Image';
import { fileMgr } from './FileManager';
import { MainView } from './MainView';
import { SpineUtile } from './SpineUtile';
const { ccclass, property } = _decorator;

const Default_Scale = 2.4;

@ccclass('MainUI')
export class MainUI extends Component {

    @property(sp.Skeleton)
    spine:sp.Skeleton = null;

    @property(MainView)
    mainView:MainView = null;

    @property(Label)
    tips:Label = null;

    @property(EditBox)
    scaleEditBox:EditBox = null;

    @property(EditBox)
    roleIDEditBox:EditBox = null;

    @property(EditBox)
    suitEditBox:EditBox = null;

    @property(EditBox)
    suitNameEditBox:EditBox = null;

    public roleSkinConfigMap:Map<number,MHData.HeroSkin> = null;//<key:occID>

    public skinPartConfigMap:Map<number,MHData.Skin> = null;//<key:skinPartId>

    public suitConfigMap:Map<number,MHData.Suit> = null;//<key:suitId>

    private partIdPool:Map<number,Array<number>> = null;//<key:skinPartId>，value:该部位的skin id的列表;

    private roleOCCID:number = null;

    private suitID:number = null;

    private suitName:string = null;

    start() {
        this.tips.enabled = false;
        this.skinPartConfigMap = new Map();
        this.roleSkinConfigMap = new Map();
        this.suitConfigMap = new Map();
        this.partIdPool = new Map();
        this._init();
    }

    async _init() {
        await this._initConfig();
        await this._initSpine();
        this._setScale(Default_Scale);
        this._initSuit();
        SpineUtile.main = this;
    }

    async _initConfig() {
        // hero skin 表
        await this._loadHeroSkinJson();
        // skin部位表
        await this._loadPartSkinJson();
        // suit表
        await this._loadSuitJson();

        this._initPartIdPool();
    }

    private _loadHeroSkinJson(){
        return new Promise<void>((resolve, reject) => {
            resources.load('json/HeroSkin',JsonAsset,(err:Error,data:JsonAsset)=>{
                const heroSkinConfig = data.json as MHData.HeroSkin[];
                heroSkinConfig.forEach(value=>{
                    this.roleSkinConfigMap.set(value.occId,value);
                })
                data.destroy();
                resolve();
            })
        })
    }

    private _loadPartSkinJson() {
        return new Promise<void>((resolve, reject) => {
            resources.load('json/Skin',JsonAsset,(err:Error,data:JsonAsset)=>{
                const skinConfig = data.json as MHData.Skin[];
                skinConfig.forEach(value=>{
                    this.skinPartConfigMap.set(value.id,value);
                })
                data.destroy();
                resolve();
            })
        })
    }

    private _loadSuitJson() {
        return new Promise<void>((resolve, reject) => {
            resources.load('json/Suit',JsonAsset,(err:Error,data:JsonAsset)=>{
                const skinConfig = data.json as MHData.Suit[];
                skinConfig.forEach(value=>{
                    this.suitConfigMap.set(value.suitId,value);
                })
                data.destroy();
                resolve();
            })
        })
    }

    private _initPartIdPool() {
        this.skinPartConfigMap.forEach(value=>{
            const part = value.part;
            let pool = this.partIdPool.get(part);
            if (!pool){
                pool = new Array<number>();
                this.partIdPool.set(part,pool);
            }
            pool.push(value.id);
        })
    }

    public getPartConfigById(partId:number):MHData.Skin{
        return this.skinPartConfigMap.get(partId);
    }

    public getHeroSkinConfigByOccID(occID:number):MHData.HeroSkin{
        return this.roleSkinConfigMap.get(occID);
    }

    public getSuitConfigBySuitID(suitID:number):MHData.Suit {
        return this.suitConfigMap.get(suitID);
    }

    private _initSpine(occID?:number) {
        return new Promise<void>((resolve, reject) => {
            const roleId = occID ? occID : 202;
            const config = this.getHeroSkinConfigByOccID(roleId);
            if (!config) return warn(`There is no hero skin config for ${roleId}!`);
            const spineFilePath = "spine/" + config.spineName + '/' + config.spineName;
            resources.load(spineFilePath,sp.SkeletonData,(err:Error,asset:sp.SkeletonData)=>{
                if (err) return error(err);
                this.spine.skeletonData = asset;
                this.spine.setAnimation(0,'show',false);
                this.spine.defaultCacheMode = sp.Skeleton.AnimationCacheMode.PRIVATE_CACHE;
                this.spine.premultipliedAlpha = false;
                resolve();
            })
            this.roleIDEditBox.string = roleId.toString();
            this.roleOCCID = roleId;
        })
    }

    private _initSuit(sutId?:number) {
        const defaultSuidId = sutId ? sutId : 202001;
        const config = this.getSuitConfigBySuitID(defaultSuidId);
        if (!config) warn(`There is no hero suit config for ${defaultSuidId}!`);
        SpineUtile.generateNewSkin(this.spine,defaultSuidId);
        this.suitID = defaultSuidId;
        this.suitEditBox.string = defaultSuidId.toString();
    }

    onGenerateClick(){
        let isExit = SpineUtile.checkSkinIsExist(this.spine,this.suitID);
        if (isExit){
            error('当前套装已存在!',this.suitID);
            return this._showTips('当前套装已存在!');
        }
        
        const newPartIds = new Array<number>();
        this.partIdPool.forEach((pardIds:number[],key:number)=>{
            const random = Math.random();
            let index = Math.ceil(random * pardIds.length) - 1;
            if (index < 0){
                index = 0;
            }
            let partId = pardIds[index];
            if (partId){
                newPartIds.push(partId);
            }
        })

        isExit = SpineUtile.checkSkinIsExist(this.spine,newPartIds);
        if (isExit){
            error('当前套装已存在!',newPartIds);
            return this._showTips('当前套装已存在!');
        }
        
        SpineUtile.generateNewSkin(this.spine,this.suitID,newPartIds);

        const roleSkinConfig = this.getHeroSkinConfigByOccID(this.roleOCCID);
        const config:MHData.Suit = {
            suitId: this.suitID,
            name: this.suitName || "",
            name_en: '',
            occId: this.roleOCCID,
            spineName: roleSkinConfig.spineName,
            parts: newPartIds
        };
        this.suitConfigMap.set(this.suitID,config);
    }

    onDeleteSuit(){
        if (!this.suitConfigMap.has(this.suitID)){
            return this._showTips(`套装${this.suitID}已删除！`);
        }

        SpineUtile.deleteSkin(this.spine,this.suitID);
        this.suitConfigMap.delete(this.suitID);
        this._showTips(`删除套装${this.suitID}成功！`);
    }

    onSaveClick(){
        this.mainView.captureScreen(this.suitID.toString());
        this._generateJson();
        this._showTips("保存成功！");
    }

    private _generateJson() {
        const arr = new Array<MHData.Suit>();
        this.suitConfigMap.forEach(value=>{
            arr.push(value);
        })
        const content = JSON.stringify(arr,null,'\t');
        fileMgr.saveForBrowser(content,"Suit.json");
    }

    private _showTips(tips:string) {
        this.tips.enabled = true;
        this.tips.string = tips;
        tween(this.tips).delay(2).hide().start();
    }

    onEditScale(editBox:EditBox){
        const scale = Number(editBox.string);
        this._setScale(scale);
    }

    onEditRoleId(editBox:EditBox){
        const roleId = Number(editBox.string);
        this._initSpine(roleId);
    }

    onEditSuitId(editBox:EditBox){
        const suitID = Number(editBox.string);
        if (!suitID){
            this._showTips("请输入suitID！");
            return;
        }
        this._initSuit(suitID);
    }

    onEditSuitName(editBox:EditBox){
        const name = editBox.string;
        this.suitName = name;
    }

    private _setScale(scale:number=1) {
        this.spine && this.spine.node.setScale(v3(scale,scale,scale));
        const originalSize = this.spine.node.getComponent(UITransform).contentSize;
        const newSize = size(originalSize.width * scale,originalSize.height * scale);
        const pos_y = newSize.height / 2;
        this.spine.node.position = v3(0,0-pos_y,0);
        this.scaleEditBox.string = scale.toString();
    }
}

