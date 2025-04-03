//Costume Data Class
import {costumeData, outfitPositions} from './CostumeData.js'

// UI Buttons Class
import UIButton, {OutfitButton} from './UIButton.js'


// Main Game Scene
class Main extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.outfit1 = null;
    }

    preload() {
        //RexUI Plugin
        this.load.scenePlugin({
        key: 'rexuiplugin',
        url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-	notes/master/dist/rexuiplugin.min.js',
        sceneKey: 'rexUI'
        });

        //Background
        this.load.image('background', 'Asset/Background/Cisini_UI_DressUp_Background.png');
        
        //player default
        this.load.image('player', 'Asset/Character/t_basebody_mc_anime_portrait.png');
        this.load.image('expression', 'Asset/Character/Normal.png');
        this.load.image('hair', 'Asset/Outfit/Hairs_upscaled/hair_01_black_F_out.png');
        
        //outfit panel
        this.load.image('outfitPanel', 'Asset/UI/Cisini_UI_Buy_Background.png');

        //outfit type buttons
        this.load.image('outfitButton', 'Asset/UI/Cisini_UI_DressUp_MenuIcon_2.png');
        this.load.image('dressIcon', 'Asset/UI/Cisini_UI_DressUp_Dress_Icon.png');
        this.load.image('outerIcon', 'Asset/UI/Cisini_UI_DressUp_Outer_Icon.png');
        this.load.image('underwearIcon', 'Asset/UI/Cisini_UI_DressUp_Underwear_Icon.png');
        this.load.image('uniformIcon', 'Asset/UI/Cisini_UI_DressUp_Uniform_Icon.png');
        this.load.image('socksIcon', 'Asset/UI/Cisini_UI_DressUp_Socks_Icon.png');
        this.load.image('shoesIcon', 'Asset/UI/Cisini_UI_DressUp_Shoes_Icon.png');

        //Outfits
        //Dress
        this.load.image('dress1', 'Asset/Outfit/terusan17.png');
        this.load.image('dress2', 'Asset/Outfit/Terusan/kebaya1.png');

        //Shirts
        this.load.image('shirt1', 'Asset/Outfit/Baju/baju_20.png');
        this.load.image('shirt2', 'Asset/Outfit/Baju/baju_01.png');

        //Underwear
        this.load.image('underwear1', 'Asset/Outfit/Bawahan/celana_33.png');

        //Uniform
        //Socks
        this.load.image('socks1', 'Asset/Outfit/Kaos Kaki/kaoskaki_29.png');

        //Shoes
        this.load.image('shoes1', 'Asset/Outfit/Sepatu/sepatu_14.png');

        //Outfit Buttons
        this.load.image('button1', 'Asset/UI/Cisini_UI_DressUp_Menu_DressInventory_2.png');

        //Dress
        this.load.image('dress1Icon', 'Asset/Outfit/ikon/Terusan/terusan17.png');
        this.load.image('dress2Icon', 'Asset/Outfit/ikon/Terusan/Kebaya_1.png');

        //Shirts
        this.load.image('shirt1Icon', 'Asset/Outfit/ikon/Baju/baju_20.png');
        this.load.image('shirt2Icon', 'Asset/Outfit/ikon/Baju/baju_01.png');

        //Underwear
        this.load.image('underwear1Icon', 'Asset/Outfit/ikon/Bawahan/celana33.png');

        //Uniform
        //Socks
        this.load.image('socks1Icon', 'Asset/Outfit/ikon/Kaos Kaki/kaoskaki_29.png');
        //Shoes
        this.load.image('shoes1Icon', 'Asset/Outfit/ikon/Sepatu/sepatu_14.png');
    }

    create() {
        const gameWidth = this.scale.width;  
        const gameHeight = this.scale.height; 
        const centerX = gameWidth / 2;
        const centerY = gameHeight / 2;

        this.changeFilterMode();
        this.setupUI();               
        this.setupCostumeButtons(this);
        this.setupCharacter();
        this.setupOutfitButtons();
    }
    changeFilterMode(){
        this.textures.get('outfitPanel').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('outfitButton').setFilter(Phaser.Textures.FilterMode.NEAREST);
         this.textures.get('button1').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('dressIcon').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('outerIcon').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('underwearIcon').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('uniformIcon').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('socksIcon').setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get('shoesIcon').setFilter(Phaser.Textures.FilterMode.NEAREST);
    }

    setupUI() {
        const gameWidth = this.scale.width;  
        const gameHeight = this.scale.height;
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        this.add.image(centerX, centerY, 'background').setOrigin(0.5, 0.5);
        
        const panelHeight = gameHeight * 0.20; 
        const panelY = gameHeight - (panelHeight / 2)
        this.bottomPanel = this.add.image(centerX, panelY, 'outfitPanel')
            .setDisplaySize(gameWidth * 2, panelHeight) 
            .setOrigin(0.5, 0.5);
    }

    setupCostumeButtons(scene){
        this.outfitButtons = {};

      
        //Add buttons for costumeData and push them into an array depending on type of costume
        costumeData.forEach(({ name, outfitType, x, y, textureAnime, textureButton, textureIcon }) => {

            const { x: outfitX, y: outfitY } = outfitPositions[outfitType] || { x: 0, y: 0 };
            const button = new OutfitButton(scene, name, outfitType, x, y, outfitX, outfitY, textureAnime, textureButton, textureIcon);
            button.container.setVisible(false); // Hide the button initially

          


            // Store the button in an array by outfit type
            if (!this.outfitButtons[outfitType]) {
                this.outfitButtons[outfitType] = [];
            }
            this.outfitButtons[outfitType].push(button);
        });


    }

    setupCharacter() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        this.add.image(centerX / 2, centerY, 'player').setScale(0.6);
        this.add.image(centerX / 2.05, centerY / 1.72, 'expression').setScale(0.9);
        this.add.image(centerX / 2.05, centerY / 1.6, 'hair').setScale(0.25);
    }

    setupOutfitButtons() {
        if (!this.bottomPanel) return;
        this.activeCategoryButtons = {};
        const categories = ["Dress", "Shirt", "Underwear", "Uniform", "Socks", "Shoes"];
        const icons = ['dressIcon', 'outerIcon', 'underwearIcon', 'uniformIcon', 'socksIcon', 'shoesIcon'];
        const numButtons = categories.length;
        let dressButton = new UIButton(this, this.scale.width -100, this.scale.height -850, 'outfitButton', 'dressIcon', () =>{console.log("Button clicked!"); this.displayButtons("Dress");});
        let outerButton = new UIButton(this, this.scale.width -100, this.scale.height - 700, 'outfitButton', 'outerIcon', () => {console.log("Button clicked!"); this.displayButtons("Shirt")});
        let underwearButton = new UIButton(this, this.scale.width -100, this.scale.height - 550, 'outfitButton', 'underwearIcon', () => {console.log("Button clicked!"); this.displayButtons("Underwear")});
        let uniformButton = new UIButton(this, this.scale.width -100, this.scale.height - 400, 'outfitButton', 'uniformIcon', () => {console.log("Button clicked!"); });
        let socksButton = new UIButton(this, this.scale.width -100, this.scale.height - 250, 'outfitButton', 'socksIcon', () => {console.log("Button clicked!"); this.displayButtons("Socks")});
        let shoesButton = new UIButton(this, this.scale.width -100, this.scale.height - 100, 'outfitButton', 'shoesIcon', () => {console.log("Button clicked!"); this.displayButtons("Shoes")});
    }

   displayButtons(outfitType) {
        // Hide all outfit buttons first
        Object.keys(this.outfitButtons).forEach(type => {
            this.outfitButtons[type].forEach(button => button.container.setVisible(false));
        });

        // Show only the selected outfit type
        if (this.outfitButtons[outfitType]) {
            this.outfitButtons[outfitType].forEach(button => button.container.setVisible(true));
        }
    }
}

// Game Configuration
const DESIGN_WIDTH = 720; 
const DESIGN_HEIGHT = 1280; 

const config = {
    type: Phaser.AUTO,
    scale: {
        parent: 'phaser-game', 
        mode: Phaser.Scale.FIT, 
        autoCenter: Phaser.Scale.CENTER_BOTH, 
        width: DESIGN_WIDTH,  
        height: DESIGN_HEIGHT 
    },
    scene: Main
    
};

const game = new Phaser.Game(config);