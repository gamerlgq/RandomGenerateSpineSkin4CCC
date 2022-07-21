
export const MHData: any;

declare module MHData{
interface Battle
{
	constant:string;
	name:string;
	value:string;
}

interface Buff
{
	id:number;
	name:string;
	effect:string;
	type:number;
	value:number;
	duration:number;
	dispel:number;
	max:number;
	show:number;
	contrary:number;
}

interface Currency
{
	id:number;
	name:string;
	des:string;
	type:number;
}

interface Equip
{
	id:number;
	name:string;
	name_en:string;
	icon:string;
	quality:string;
	type:string;
	value:string;
	des:string;
	original_name:string;
}

interface Fuse
{
	ActionA:string;
	ActionB:string;
	Time:number;
}

interface Guide
{
	group:number;
	step:number;
	next:number;
	enforce:number;
	guide:number;
	condiction:string;
	text:string;
	comeback:number;
}

interface Hero
{
	Uuid:number;
	Name:string;
	race:number;
	ObjectTag:string;
	img:string;
	head:string;
	model:string;
	vision:number;
	high:number;
	volume:number;
	Bluk:number;
	hp_bar:number;
	HP:number;
	ATK:number;
	PD:number;
	MD:number;
	MS:number;
	AS:number;
	EP:number;
	MP:number;
	ARE:number;
	convert_hp:number;
	convert_atk:number;
	convert_def:number;
	convert_res:number;
	convert_spd:number;
	convert_atk_spd:number;
	convert_energy:number;
	convert_dmg:number;
}

interface HeroSkin
{
	occId:number;
	name:string;
	spineName:string;
	skinId:number[];
	suitIds:number[];
}

interface Item
{
	id:number;
	name:string;
	icon:string;
	quality:number;
	superposition:number;
	type:number;
	value:number;
	des:string;
}

interface Mail
{
	id:number;
	title:string;
	content:string;
}

interface Monster
{
	Uuid:number;
	Name:string;
	ObjectTag:string;
	model:string;
	Kind:number;
	hp_bar:number;
	high:number;
	vision:number;
	Bluk:number;
	SP:number;
	SL:string;
	HP:number;
	ATK:number;
	PD:number;
	MD:number;
	MS:number;
	AS:number;
}

interface Qualifying
{
	id:number;
	display_name:string;
	star:number;
	display_style:number;
	img:string;
	integral:number;
	bounds:string;
	reward:number;
	demote:number;
}

interface Randomname
{
	hero_id:number;
	name:string;
}

interface Rank
{
	rank:number;
	rank_max:number;
	reward:number;
}

interface Reward
{
	id:number;
	name:string;
	drop:number;
}

interface BaseMod
{
	MyselfMod:number;
	TargetMod:number;
	Kind:number;
	Count:number;
	Times:number;
	Interval:number;
	Immunity:number[];
	Disperse:number[];
}

interface Calcul
{
	Method:number;
	Radius:number;
	Angle:number;
	Distance:number;
}

interface Damage
{
	DamagePR:number;
	DamageMR:number;
	CritRate:number;
	CritDamage:number;
}

interface Follow
{
	Object:number;
	Times:number;
	Interval:number;
}

interface Skill
{
	Uuid:number;
	NameCH:string;
	NameEN:string;
	Describe:string;
	icon:string;
	Class:number;
	Energy:number;
	PreTime:number;
	SufTime:number;
	Premise:number;
	Choice:number;
	Radius:number;
	action:string;
	effect:number;
	SkillEffect:SkillEffect[];
}

interface SkillEffect
{
	Target:number[];
	RolesNum:number;
	Choice:number;
	Damage:Damage;
	Follow:Follow;
	Calcul:Calcul;
	BaseMod:BaseMod[];
}

interface Skin
{
	id:number;
	name:string;
	name_en:string;
	part:number;
	partName:string;
	slot:number;
	occId:number;
	skinName:string;
	spineName:string;
	des:string;
}

interface Sound
{
	id:number;
	name:string;
	des:string;
}

interface List
{
	DesID:number;
	Ratio:number;
	EleUid:number;
	Ucount:number;
	EleDid:number;
	Dcount:number;
}

interface Story
{
	StoryBorn:StoryBorn[];
	StoryStep:StoryStep[];
	StoryEle:StoryEle[];
	StorySki:StorySki[];
}

interface StoryBorn
{
	Event:number;
	QltID:number;
	OccID:number;
	DesID:number;
	DesText:string;
}

interface StoryEle
{
	OptID:number;
	Event:number;
	OptText:string;
	List:List[];
}

interface StorySki
{
	OptID:number;
	OptText:string;
	DesID:number;
	SkiID:number;
	DesText:string;
	Event:number;
}

interface StoryStep
{
	Event:number;
	Stage:number;
	DesID:number;
	DesText:string;
	Front:number;
	QtMin:number;
	QtMax:number;
}

interface Suit
{
	suitId:number;
	name:string;
	name_en:string;
	occId:number;
	spineName:string;
	parts:number[];
}

interface Summon
{
	quality:number;
	name:string;
	rate:number;
}

}
