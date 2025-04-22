//Asset Loader Class
import AssetLoader from './AssetLoader.js'

// UI Manager Class
import {UIManager} from './UI/UIManager.js'

// OutfitButton Class
import {OutfitButton} from './UI/UIButton.js'

//DialogueManager Class
import {DialogueManager} from './Dialogue System/DialogueManager.js'

//DialogueData Class
import {DialogueData} from './Dialogue System/DialogueData.js'

//CutsceneSystem Class
import {CutsceneSystem} from './Cutscene System/CutsceneSystem.js'



//Stat Tracker Class
import {statTracker} from './Outfit Data/CostumeManager.js'

//Audio Manager Class
import {AudioManager} from './Audio System/AudioManager.js'


function loadFont(name, url) {
    const newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
        console.log(`Font "${name}" has been loaded.`);
    }).catch(function (error) {
        console.error(`Failed to load font "${name}":`, error);
    });
}

// Main Game Scene
class Main extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        loadFont('pixelFont', 'Asset/Font/Pixellari.ttf');

        AssetLoader.loadAllAssets(this);
        this.DialogueManager = new DialogueManager(this);
        this.CutsceneSystem = new CutsceneSystem(this);
        this.statTracker = new statTracker(this);
        this.AudioManager = new AudioManager(this);
    }

    create() {
        this.UIManager = new UIManager(this, this.AudioManager);
        this.dialogueContainer = {};
        this.AudioManager.initializeSounds();
        this.cutsceneSystem = new CutsceneSystem(this);
        this.CutsceneSystem.initiateCutscene1();
        this.DialogueManager.createDialogueUI();
        
        //this.setupDressMiniGame();

    }

    initializeDialogueSystem() {
        this.DialogueManager = new DialogueManager(this);
        this.DialogueManager.createDialogueUI();
    }
   
    setupDressMiniGame(){
       
        this.UIManager.setupScene(this);
        this.UIManager.setupCostumeButtons(this);
        this.UIManager.setupCategoryButtons(this);
        this.cutsceneSystem.createContinueButton();
    }

    displayCategoryButtons() {
        this.categoryButtonsPanel.setVisible(true);

        const buttons = [this.dressShirtButton, this.outerButton, this.underwearButton, this.uniformButton, this.socksButton, this.shoesButton];
        buttons.forEach(button => {
            if (button) button.setVisible(true);
        });

        this.tweens.add({
            targets: this.categoryButtonsPanel,
            x: this.scale.width - 100,
            duration: 500,
            repeat: 0,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.tweens.add({
                    targets: buttons,
                    alpha: 1,
                    duration: 500,
                    ease: 'Linear'
                });
            }
        });

        this.tweens.add({
            targets: this.openButton,
            x: this.scale.width - 200,
            duration: 500,
            repeat: 0,
            ease: 'Sine.easeInOut'
        });

        // Tween the player and related elements
        const newPlayerX = this.scale.width / 4.2;
        this.tweens.add({
            targets: [this.player, this.hair, this.expression],
            x: newPlayerX,
            duration: 500,
            repeat: 0,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: [this.background],
            x: this.scale.width,
            duration: 500,
            repeat: 0,
            ease: 'Sine.easeInOut'
        });

        // Tween all selected outfits to follow the player
        console.log(`displayCategoryButtons: player.y = ${this.player.y}`); // Debug log
        Object.values(this.outfitButtons).flat().forEach(outfitButton => {
            outfitButton.tweenOutfit(newPlayerX, this.player.y, 500, 'Sine.easeInOut');
        });
    }

    hideCategoryButtons() {
        return new Promise((resolve) => {
            const buttons = [this.dressShirtButton, this.outerButton, this.underwearButton, this.uniformButton, this.socksButton, this.shoesButton];
            buttons.forEach(button => {
                if (button) this.tweens.killTweensOf(button);
            });

            this.tweens.add({
                targets: buttons,
                alpha: 0,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {
                    buttons.forEach(button => {
                        if (button) button.setVisible(false);
                    });

                    // Create promises for all tweens
                    const panelTweenPromise = new Promise((panelResolve) => {
                        this.tweens.add({
                            targets: [this.categoryButtonsPanel],
                            x: this.scale.width + 100,
                            duration: 300,
                            ease: 'Sine.easeInOut',
                            onComplete: () => {
                                this.categoryButtonsPanel.setVisible(false);
                                panelResolve();
                            }
                        });
                    });

                    const openButtonTweenPromise = new Promise((openButtonResolve) => {
                        this.tweens.add({
                            targets: this.openButton,
                            x: this.scale.width - 20,
                            duration: 300,
                            ease: 'Sine.easeInOut',
                            onComplete: openButtonResolve
                        });
                    });

                    const playerTweenPromise = new Promise((playerResolve) => {
                        const newPlayerX = this.scale.width / 2;
                        this.tweens.add({
                            targets: [this.player, this.hair, this.expression],
                            x: newPlayerX,
                            duration: 500,
                            repeat: 0,
                            ease: 'Sine.easeInOut',
                            onComplete: playerResolve
                        });

                        // Tween all selected outfits to follow the player
                        Object.values(this.outfitButtons).flat().forEach(outfitButton => {
                            outfitButton.tweenOutfit(newPlayerX, this.player.y, 500, 'Sine.easeInOut');
                        });
                    });

                    const backgroundTweenPromise = new Promise((backgroundResolve) => {
                        this.tweens.add({
                            targets: [this.background],
                            x: this.scale.width + 190,
                            duration: 500,
                            repeat: 0,
                            ease: 'Sine.easeInOut',
                            onComplete: backgroundResolve
                        });
                    });

                    // Wait for all tweens to complete before resolving
                    Promise.all([
                        panelTweenPromise,
                        openButtonTweenPromise,
                        playerTweenPromise,
                        backgroundTweenPromise
                    ]).then(() => {
                        resolve();
                    });
                }
            });
        });
    }

    async displayButtons(outfitType) {
        const isDressSelected = !!OutfitButton.selectedOutfits["Dress"];

        this.activePanel = "outfit";
        this.UIManager.setCostumeButtons(outfitType, this);
        this.outfitButtonsTypePanel.setVisible(true);
        this.currentType = outfitType;

        const typesToHide = outfitType === "DressShirt" 
            ? Object.keys(this.outfitButtons).filter(type => type !== "Dress" && type !== "Shirt")
            : Object.keys(this.outfitButtons).filter(type => type !== outfitType);

        typesToHide.forEach(type => {
            this.outfitButtons[type].forEach(button => button.container.setVisible(false));
        });

        await this.hideCategoryButtons();

        let buttonsToShow = [];
        if (outfitType === "DressShirt") {
            buttonsToShow = [...(this.outfitButtons["Dress"] || []), ...(this.outfitButtons["Shirt"] || [])];
        } else {
            buttonsToShow = this.outfitButtons[outfitType] || [];
        }

        buttonsToShow.forEach(button => {
            button.container.setVisible(true);
            button.button.setAlpha(0);
            button.icon.setAlpha(0);
        });

        this.tweens.add({
            targets: this.background,
            y: this.scale.height / 2.06,
            duration: 500,
            ease: 'Sine.easeInOut'
        });

        const newPlayerY = this.scale.height - 800;
        this.tweens.add({
            targets: this.player,
            y: newPlayerY,
            duration: 500,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: this.hair,
            y: this.scale.height - 1020,
            duration: 500,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: this.expression,
            y: this.scale.height - 1065,
            duration: 500,
            ease: 'Sine.easeInOut'
        });

        const outfitContainers = buttonsToShow.map(button => button.container);
        this.tweens.add({
            targets: outfitContainers,
            y: this.scale.height - 130,
            duration: 500,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: this.outfitButtonsTypePanel,
            y: this.scale.height - 130,
            duration: 500,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                buttonsToShow.forEach(button => {
                    this.tweens.add({
                        targets: [button.button, button.icon],
                        alpha: 1,
                        duration: 300,
                        ease: 'Sine.easeInOut'
                    });
                });
            }
        });

        Object.values(this.outfitButtons).flat().forEach(outfitButton => {
            outfitButton.tweenOutfit(this.player.x, newPlayerY, 500, 'Sine.easeInOut');
        });
    }

    async hideButtons(outfitType) {
        return new Promise((resolve) => {
            let buttonsToHide = [];
            if (outfitType === "DressShirt") {
                buttonsToHide = [...(this.outfitButtons["Dress"] || []), ...(this.outfitButtons["Shirt"] || [])];
            } else {
                buttonsToHide = this.outfitButtons[outfitType] || [];
            }

            buttonsToHide.forEach(button => {
                this.tweens.add({
                    targets: [button.button, button.icon],
                    alpha: 0,
                    duration: 300,
                    ease: 'Linear'
                });
            });

            setTimeout(() => {
                const backgroundTweenPromise = new Promise((backgroundResolve) => {
                    this.tweens.add({
                        targets: this.background,
                        y: this.scale.height / 2,
                        duration: 500,
                        ease: 'Sine.easeInOut',
                        onComplete: backgroundResolve
                    });
                });

                const playerTweenPromise = new Promise((playerResolve) => {
                    const newPlayerY = this.scale.height - 600;
                    this.tweens.add({
                        targets: this.player,
                        y: newPlayerY,
                        duration: 500,
                        ease: 'Sine.easeInOut',
                        onComplete: playerResolve
                    });

                    Object.values(this.outfitButtons).flat().forEach(outfitButton => {
                        outfitButton.tweenOutfit(this.player.x, newPlayerY, 500, 'Sine.easeInOut');
                    });
                });

                const hairTweenPromise = new Promise((hairResolve) => {
                    this.tweens.add({
                        targets: this.hair,
                        y: this.scale.height - 820,
                        duration: 500,
                        ease: 'Sine.easeInOut',
                        onComplete: hairResolve
                    });
                });

                const expressionTweenPromise = new Promise((expressionResolve) => {
                    this.tweens.add({
                        targets: this.expression,
                        y: this.scale.height - 865,
                        duration: 500,
                        ease: 'Sine.easeInOut',
                        onComplete: expressionResolve
                    });
                });

                const panelTweenPromise = new Promise((panelResolve) => {
                    this.tweens.add({
                        targets: this.outfitButtonsTypePanel,
                        y: this.scale.height + 300,
                        duration: 500,
                        ease: 'Sine.easeInOut',
                        onComplete: () => {
                            this.outfitButtonsTypePanel.setVisible(false);
                            panelResolve();
                        }
                    });
                });

                const outfitContainers = buttonsToHide.map(button => button.container);
                const containersTweenPromise = new Promise((containersResolve) => {
                    this.tweens.add({
                        targets: outfitContainers,
                        y: this.scale.height + 200,
                        duration: 500,
                        ease: 'Sine.easeInOut',
                        onComplete: () => {
                            buttonsToHide.forEach(button => {
                                button.container.setVisible(false);
                            });
                            containersResolve();
                        }
                    });
                });

                Promise.all([
                    backgroundTweenPromise,
                    playerTweenPromise,
                    hairTweenPromise,
                    expressionTweenPromise,
                    panelTweenPromise,
                    containersTweenPromise
                ]).then(() => {
                    console.log(`hideButtons completed: player.y = ${this.player.y}`);
                    resolve();
                });
            }, 300);
        });
    }

    displayBackButton(){
         this.tweens.add({
            targets: this.backButton,
            y: 250,
            duration: 500,
            ease: 'Sine.easeInOut'
        });
    }

    hideBackButton(){
        this.backButton.disableInteractive();
         this.tweens.add({
            targets: this.backButton,
            y: 0,
            duration: 500,
            ease: 'Sine.easeInOut'
        });
    }
}

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 720,
        height: 1280,
    },
    scene: Main
};

const game = new Phaser.Game(config);