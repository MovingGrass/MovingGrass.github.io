// Costume Data Class
import {costumeData, outfitPositions, statTracker} from '../Outfit Data/CostumeManager.js'

// UI Buttons Class
import UIButton, {OutfitButton} from './UIButton.js'

export class UIManager {
    constructor(scene, AudioManager) {
        scene.scene = scene;
        scene.panelVisible = false;
        scene.outfitpanelVisible = false;
        this.AudioManager = AudioManager;
    }

    /**
     * @method setupScene - Setup the scene by setting background and character
     */
    setupScene(scene) {
        // Setup background
        const centerX = scene.scale.width / 2;
        const centerY = scene.scale.height / 2;
        scene.background = scene.add.image(centerX / 0.5, centerY, 'background').setScale(1.2);

        // Setup character
        scene.player = scene.add.image(centerX / 2, centerY / 0.9, 'player').setScale(0.6);
        scene.expression = scene.add.image(centerX / 2.04, centerY / 1.43, 'expression').setScale(0.9);
        scene.hair = scene.add.image(centerX / 2.04, centerY / 1.3, 'hair').setScale(0.25);

        console.log("Initial background y:", scene.background.y);
        console.log("Initial player y:", scene.player.y);
        console.log("Initial hair y:", scene.hair.y);
        console.log("Initial expression y:", scene.expression.y);

        //Setup back button
        scene.backButton = new UIButton(scene, this.AudioManager, 70, -100, 'outfitButton', 'backButton', () => { 
            if (scene.activePanel === "outfit") {
                scene.hideButtons(scene.currentType); 
                scene.activePanel = null;
                scene.hideBackButton(); // hide back button
                this.AudioManager.playSFX('buttonClick');
            } else {
                 scene.hideBackButton(); // hide back button
            }
        }).container.setAlpha(1);

        // Setup stat panel
        scene.statTracker.setupStatPanel(scene);    
    }

    clearDressupScene(scene) {
        // 1. Destroy outfit and UI containers
        if (scene.outfitButtons) {
            Object.values(scene.outfitButtons).flat().forEach(button => {
                button.displayedOutfit?.destroy();
                button.container?.destroy();
            });
            scene.outfitButtons = {};
        }
    
        // 2. Destroy stat panel
        scene.statPanel?.destroy();
        scene.statText?.destroy();
        scene.currentStatText?.destroy();
    
        // 3. Destroy category panels and buttons
        scene.categoryButtonsPanel?.destroy();
        scene.outfitButtonsTypePanel?.destroy();
        scene.openButton?.destroy();
        scene.continueButton?.destroy();
    
        // 4. Reset outfit selections
        OutfitButton.selectedOutfits = {};
    
        // 5. Destroy background
        scene.background?.destroy();
        scene.AudioManager?.fadeOutMusic('minigameMusic', 500);

    }
    

    /**
     * @method setupCategoryButtons - Sets up the category buttons for different types of outfit
     */
    setupCategoryButtons(scene) {
        // Define the toggle function and attach it to the scene
        scene.toggleCategoryPanel = async function () {
            if (scene.activePanel === "category") {
                await scene.hideCategoryButtons();
                scene.activePanel = null;
            } else {
                if (scene.activePanel === "outfit") {
                    await scene.hideButtons(scene.currentType);
                    scene.hideBackButton();
                }
                scene.displayCategoryButtons();
                scene.activePanel = "category";
              
            }
        };

        // Create the panel and button
        scene.categoryButtonsPanel = scene.add.image(scene.scale.width + 200, scene.scale.height / 1.95, 'categoryButtonsPanel').setDisplaySize(200, 1000);
        scene.categoryButtonsPanel.setVisible(false);

        scene.activePanel = null;

        scene.openButton = scene.add.image(scene.scale.width, scene.scale.height - 700, 'openIcon')
            .setScale(5)
            .setInteractive()
            .on('pointerdown', () => {
                scene.toggleCategoryPanel();
                this.AudioManager.playSFX('openPanel');
            });
        scene.openButton.angle = 270;

        // Outfit buttons with their corresponding outfit types
        scene.dressShirtButton = new UIButton(scene, this.AudioManager, scene.scale.width - 100, scene.scale.height - 950, 'outfitButton', 'dressIcon', () => { 
            scene.displayButtons("DressShirt"); 
            this.AudioManager.playSFX('buttonClick');  
            scene.displayBackButton();
        }).container;

        scene.outerButton = new UIButton(scene, this.AudioManager, scene.scale.width - 100, scene.scale.height - 800, 'outfitButton', 'outerIcon', () => { 
            scene.displayButtons("Outer"); 
            this.AudioManager.playSFX('buttonClick');  
            scene.displayBackButton();
        }).container;

        scene.underwearButton = new UIButton(scene, this.AudioManager, scene.scale.width - 100, scene.scale.height - 650, 'outfitButton', 'underwearIcon', () => { 
            scene.displayButtons("Underwear"); 
            this.AudioManager.playSFX('buttonClick');  
            scene.displayBackButton();
        }).container;

        scene.socksButton = new UIButton(scene, this.AudioManager, scene.scale.width - 100, scene.scale.height - 500, 'outfitButton', 'socksIcon', () => { 
            scene.displayButtons("Socks"); 
            this.AudioManager.playSFX('buttonClick');  
            scene.displayBackButton();
        }).container;

        scene.shoesButton = new UIButton(scene, this.AudioManager, scene.scale.width - 100, scene.scale.height - 350, 'outfitButton', 'shoesIcon', () => { 
            scene.displayButtons("Shoes"); 
            this.AudioManager.playSFX('buttonClick');  
            scene.displayBackButton();
        }).container;

        scene.hideCategoryButtons();
    }


    /**
     * @method setupCostumeButtons - Initializes an array and creates costumedata SOs and stores it in the array created based on its type
     */
    setupCostumeButtons(scene) {
        const COLOR_PRIMARY = 0x4e342e;
        const COLOR_LIGHT = 0x7b5e57;
        const COLOR_DARK = 0x260e04;

        scene.outfitButtons = {};

        // Add buttons to the panel
        costumeData.forEach(({ name, outfitType, x, y, textureAnime, textureButton, textureIcon, stat}) => {
            const { x: outfitX, y: outfitY } = outfitPositions[outfitType] || { x: 0, y: 0 };
            const button = new OutfitButton(scene, name, outfitType, x, y, outfitX, outfitY, textureAnime, textureButton, textureIcon, stat, scene.statTracker, scene.AudioManager);

            // Optional: Hide/show by type
            button.container.setSize(150, 200).setVisible(false);

            if (!scene.outfitButtons[outfitType]) {
                scene.outfitButtons[outfitType] = [];
            }
            scene.outfitButtons[outfitType].push(button);
        });
    }

    // Creates a new panel based on the outfit type
    setCostumeButtons(outfitType, scene) {
        const COLOR_PRIMARY = 0x4e342e;
        const COLOR_LIGHT = 0x7b5e57;
        const COLOR_DARK = 0x260e04;

        let buttons = [];
        if (outfitType === "DressShirt") {
            buttons = [...(scene.outfitButtons["Dress"] || []), ...(scene.outfitButtons["Shirt"] || [])];
        } else {
            buttons = scene.outfitButtons[outfitType] || [];
        }

        const buttonList = buttons.map(b => b.container);
        const buttonGrid = scene.rexUI.add.gridSizer({
            column: buttonList.length,
            row: 1,
            space: { column: 100, row: -100 },
        });

        // Add buttons to the grid
        buttonList.forEach((btnContainer, index) => {
            buttonGrid.add(btnContainer, index, 0, 'center', 0, false);
        });

        const panelBackground = scene.add.image(0, 0, 'categoryButtonsPanel').setAlpha(0.9);
        panelBackground.setDepth(7);

        // Create the scrollable panel
        scene.outfitButtonsTypePanel = scene.rexUI.add.scrollablePanel({
            x: 360,
            y: 1500,
            width: 700,
            height: 250,
            scrollMode: 1,

            background: panelBackground,

            panel: {
                child: buttonGrid,
                mask: {
                    padding: 2
                }
            },

            slider: {
                track: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK).setDepth(8),
                thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT).setDepth(8),
            },

            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                panel: 10
            }
        }).layout().setVisible(false);

        Object.values(scene.outfitButtons).flat().forEach(button => {
            button.container.setDepth(8);
            button.button.setDepth(8);
            button.icon.setDepth(8);
        });

        Object.values(scene.outfitButtons).flat().forEach(button => {
            scene.sys.displayList.bringToTop(button.container);
        });

        const maskGraphics = scene.add.graphics();
        const panelWidth = 693;

        maskGraphics.fillStyle(0xffffff);
        maskGraphics.fillRect(12, 0, panelWidth, 10000);
        maskGraphics.setVisible(false);

        const mask = maskGraphics.createGeometryMask();

        Object.values(scene.outfitButtons).flat().forEach(button => {
            button.container.setMask(mask);
        });

        scene.outfitPanelMaskGraphics = maskGraphics;
        scene.outfitButtonsTypePanel.layout();
    }
}