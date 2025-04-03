import {CostumeType, CostumeData} from CostumeData.js
import UIButton from UIButton.js

class UIManager{
	constructor(scene, costumes, currentType, currentPanelItems, dress, shirt, pants, work, socks, shoes) {
        this.scene = scene;
        this.costumes = costumes;
        this.currentPanelItems = []; 
        this.currentType = null;
	this.dress= null;
	this.shirt= null;
	this.pants = null;
	this.work= null;
	this.socks= null;
	this.shoes= null;
    }
}
preload()
{
	//plugin for UI scrollable panel and grid (probably)
	this.load.scenePlugin({
        key: 'rexuiplugin',
        url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-	notes/master/dist/rexuiplugin.min.js',
        sceneKey: 'rexUI'
        });
    
	//UI Buttons to display the different types of costume
	this.load.image("dressButton", "Asset/UI/Cisini_UI_DressUp_Dress_Icon.png");
	this.load.image("shirtButton", "Asset/UI/Cisini_UI_DressUp_Outer_Icon.png");
	this.load.image("pantsButton", "Asset/UI/Cisini_UI_DressUp_Underwear_Icon.png");
	this.load.image("workButton", "Asset/UI/Cisini_UI_DressUp_Uniform_Icon.png");
	this.load.image("sockButton", "Asset/UI/Cisini_UI_DressUp_Socks_Icon.png");
	this.load.image("shoeButton", "Asset/UI/Cisini_UI_DressUp_Shoes_Icon.png");
	/*the rest of the aset*/
	
	this.load.image("textureButton","Asset/baju_06.png");

	//UI Panel to display the icon of outfits
	this.load.image("UIPanel", "Asset/UI/Cisini_UI_Buy_Background.png");
	this.load.image("iconButton","Asset/UI/Cisini_UI_DressUp_Menu_DressInventory_2.png");

	this.load.image("textureButton2", "Asset/baju_06.png");
    
}

function InitializeUI(){
	this.panel = this.scene.add.image(600, 300, "UIPanel");
	let buttonDress = new UIButton(x, y, textureButton,dressButton,() => this.DisplayCurrentPanel(CostumeType.DRESS));
	let shirtDress = new UIButton(x, y, textureButton, shirtButton,() =>  this.DisplayCurrentPanel(CostumeType.SHIRT));
	/*the rest of the aset*/
	
}

function DisplayCurrentPanel(type){
	this.currentPanelItems.forEach(item => item.destroy()); 
	this.currentPanelItems = []
	this.currentType = type;

	
	const filteredCostumes = this.costumes.filter(costume => costume.type === type);

	
	filteredCostumes.forEach((costume, index) => {

		const x = 550 + (index % 3) * 60; // Adjust positions as needed
		const y = 250 + Math.floor(index / 3) * 60;


		const costumeButton = new UIButton(x, y, "textureButton", costume.textureIcon, () => {

			DisplayOutfit(costume.textureAnime, costume.type);

			});
		
		this.currentPanelItems.push(costumeButton.container);
		});
	}
	


function DisplayOutfit(Outfit, type){
	if(type == DRESS){
		 // display outfit disini
	}else if(type == SHIRT){

	}
	
}
export default UIManager;