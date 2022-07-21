import { error, sp, utils } from "cc";
import { MHData } from "../../declarations/MHData";
import { MainUI } from "./MainUI";

export class SpineUtile { 
         
    public static main:MainUI;
    
    /**
     * @description 换皮肤
     * @param skinName:string 皮肤id
     */
    public static changeSkin(spine:sp.Skeleton,skinName:string) {
        spine.setSkin(skinName);
    }

    /**
     * @description 查找插槽
     */
    public static findSlot(spine:sp.Skeleton,name:string):spine.Slot {
        return spine.findSlot(name);
    }
    
    /**
     * 
     * @param spine
     * @param slotName 插槽名字
     * @param attachmentName attachment名字
     * @returns pine.Attachment
     */
    public static findAttachment(spine:sp.Skeleton,slotName:string,attachmentName:string):spine.Attachment{
        return spine.getAttachment(slotName,attachmentName);
    }

    public static getSpineColor(r:number,g:number,b:number,a:number):spine.Color{
        return new sp.spine.Color(r,g,b,a);
    }
    /**
     * 
     * @description 更换皮肤的单间装备
     * @param skinName 新皮肤名字（装备所在的皮肤）
     * @param oldSlotName 旧插槽的名字
     * @param newSlotName 新插槽的名字
     */
    public static changeEquip(spine:sp.Skeleton,skinName:string,oldSlotName:string,newSlotName:string){
        let skin_origin = spine._skeleton.skin.name
        let slot_origin = SpineUtile.findSlot(spine,oldSlotName);
        if (!slot_origin) return error(`Can not find slot for ${skin_origin}`);
        this.changeSkin(spine,skinName);
        let slot_new = this.findSlot(spine,newSlotName);
        if (!slot_new) return error(`Can not find slot for ${slot_new}`);
        let attachment_new = slot_new.getAttachment();
        console.log("attachment_new",attachment_new);
        this.changeSkin(spine,skin_origin);
        slot_origin.setAttachment(attachment_new);
        console.log("slot_origin",slot_origin);
    }

    public static generateNewSkin(skeleton:sp.Skeleton,newSuitId:number,parts?:number[]){
        if (SpineUtile.checkSkinIsExist(skeleton,newSuitId)){
            SpineUtile.changeSkin(skeleton,newSuitId.toString());
            return;
        }

        if (!parts){
            return;
        }
     
        const newskin = new sp.spine.Skin(newSuitId.toString());        
        const slots = skeleton.skeletonData.getRuntimeData().slots;
        for (let index = 0; index < parts.length; index++) {
            const partId = parts[index];
            const config = SpineUtile.main.getPartConfigById(partId);
            skeleton.setSkin(config.skinName.toString());
            for (let index = 1; index <= config.slot; index++) {
                const slotName = config.partName + index;
                const slot = this.findSlot(skeleton,slotName);
                if (slot){
                    const attachment = slot.getAttachment();
                    if (attachment){
                        const slotIndex = slot.data.index;
                        const slotData = slots[slotIndex];
                        newskin.setAttachment(slotIndex,slotData.attachmentName,attachment);
                    }else{
                        error(`Can not find attachment for ${partId}`);
                    }
                }else{
                    error(`Can not find slot for ${partId}`);
                } 
            }
        }
        
        skeleton.skeletonData.getRuntimeData().skins.push(newskin);
        console.log("newskins",skeleton.skeletonData.getRuntimeData().skins);
        skeleton.setSkin(newskin.name);    
    }

    public static checkSkinIsExist(skeleton:sp.Skeleton,suitIdOrParts:number|number[]):boolean {
        if ( typeof suitIdOrParts == 'number'){
            const newSuitId = suitIdOrParts;
            const skins = skeleton.skeletonData.getRuntimeData().skins;
            for (let index = 0; index < skins.length; index++) {
                const skin = skins[index];
                if (skin.name == newSuitId.toString()){
                    return true;
                }
            }
            return false;
        }
      
        const newPartsMD5 = MD5(suitIdOrParts);
        const keys = SpineUtile.main.suitConfigMap.keys();
        let key:IteratorResult<number>;
        while ((key = keys.next()),(!key.done)) {
            const suitID = key.value;
            const value = SpineUtile.main.suitConfigMap.get(suitID);
            const md5Value = MD5(value.parts);
            if (newPartsMD5 == md5Value){
                return true;
            }
        }

        return false;
    }

    public static deleteSkin(skeleton:sp.Skeleton,suitId:number){
        if (!SpineUtile.checkSkinIsExist(skeleton,suitId)){
            return;
        }
        const skins = skeleton.skeletonData.getRuntimeData().skins;
        // SpineUtile.changeSkin(skeleton,skins[0].name);
        for (let index = skins.length - 1; index >= 0; index++) {
            const skin = skins[index];
            if (skin && skin.name == suitId.toString()){
                skins.splice(index);
                break ;
            }
        }
        console.log("deleteskins",skeleton.skeletonData.getRuntimeData().skins);
    }
}