import { outfitCustomSizes, outfitManualOffsets } from "../Outfit Data/CostumeManager.js";

export default class UIButton {
    constructor(scene, AudioManager, x, y, textureButton, textureIcon, callback) {
        this.scene = scene; // Store scene reference
        this.AudioManager = AudioManager;

        // Create the button and icon using the scene
        this.button = scene.add.image(0, 0, textureButton).setInteractive().setDisplaySize(30, 30);
        this.icon = scene.add.image(0, 0, textureIcon);
        this.container = scene.add.container(x, y, [this.button, this.icon]).setScale(4).setAlpha(0);

        // Add hover effects
        this.button.on("pointerover", () => {
            this.button.setAlpha(0.7);
            this.AudioManager.playSFX('hoverButton');
        });
        this.button.on("pointerout", () => this.button.setAlpha(1));

        // Click event
        this.button.on("pointerdown", () => {
            if (callback) callback();
        });
    }
}

export class ContinueButton {
    constructor(scene, x, y, textureKey, label, onClick) {
        this.scene = scene;

        const buttonImage = scene.add.image(0, 0, textureKey)
            .setDisplaySize(250, 80)
            .setInteractive();

        const buttonText = scene.add.text(0, 0, label, {
            fontSize: '28px',
            fontFamily: 'pixelFont',
            color: '#000000'
        }).setOrigin(0.5);

        this.container = scene.add.container(x, y, [buttonImage, buttonText]);

        buttonImage.on('pointerdown', onClick);
        buttonImage.on('pointerover', () => buttonImage.setAlpha(0.8));
        buttonImage.on('pointerout', () => buttonImage.setAlpha(1));
    }
}

export class OutfitButton {
    static selectedOutfits = {}; // To store currently selected outfits

    constructor(scene, name, outfitType, x, y, outfitX, outfitY, textureAnime, textureButton, textureIcon, stat, statTracker, AudioManager) {
        this.scene = scene; // Store scene reference
        this.name = name; // Store name for debugging
        this.outfitType = outfitType; // Store outfit type
        this.textureAnime = textureAnime; // Store anime texture reference
        this.outfitX = outfitX; // Store the intended outfit position
        this.outfitY = outfitY;
        this.stat = stat;
        this.statTracker = statTracker;
        this.AudioManager = AudioManager;

        // Create the button and icon using the scene
        this.button = scene.add.image(0, 0, textureButton).setInteractive().setDisplaySize(150, 200);
        this.icon = scene.add.image(0, 0, textureIcon);

       
        const statColor = stat > 0 ? '#00ff00' : '#ff0000';
        this.statText = scene.add.text(50, 70, stat.toString(), {
            fontSize: '28px',
            fontFamily: 'pixelFont',
            color: statColor
        }).setOrigin(0.5);

        // Add the button, icon, and stat text to the container
        this.container = scene.add.container(x, y, [this.button, this.icon, this.statText]);

        // Add hover effects
        this.button.on("pointerover", () => this.button.setAlpha(0.7));
        this.button.on("pointerout", () => this.button.setAlpha(1));

        // Click event
        this.button.on("pointerdown", () => {
            this.toggleOutfit(outfitX, outfitY, outfitType);
            this.AudioManager.playSFX('buttonClick');
        });
    }

    toggleOutfit(outfitX, outfitY) {
        const { scene, textureAnime, stat, outfitType } = this;

        const depthValues = {
            "Socks": 1,
            "Shoes": 2,
            "Underwear": 3,
            "Shirt": 4,
            "Outer": 4.5,
            "Dress": 5
        };

        const isDressSelected = !!OutfitButton.selectedOutfits["Dress"]?.current;

        let alreadyUnequipped = false;

        // === 1. DRESS OVERRIDE LOGIC ===
        if (outfitType === "Dress") {
            Object.keys(OutfitButton.selectedOutfits).forEach(type => {
                if (type !== "Dress" && type !== "Shoes") {
                    const entry = OutfitButton.selectedOutfits[type];
                    if (entry?.current) {
                        // Subtract stat of unequipped outfit
                        this.statTracker.setStat(entry.current.stat, false);
                        alreadyUnequipped = true;

                        // Destroy visual
                        if (entry.current.displayedOutfit) {
                            entry.current.displayedOutfit.destroy();
                        }

                        // Move to previous
                        OutfitButton.selectedOutfits[type] = {
                            current: null,
                            previous: entry.current
                        };
                    }
                }
            });
        }

        // === 2. NON-DRESS OVERRIDES DRESS ===
        if (outfitType !== "Dress" && outfitType !== "Shoes" && isDressSelected) {
            const dressEntry = OutfitButton.selectedOutfits["Dress"];
            if (dressEntry?.current) {
                this.statTracker.setStat(dressEntry.current.stat, false);
                alreadyUnequipped = true;

                if (dressEntry.current.displayedOutfit) {
                    dressEntry.current.displayedOutfit.destroy();
                }

                OutfitButton.selectedOutfits["Dress"] = {
                    current: null,
                    previous: dressEntry.current
                };
            }
        }

        // === 3. REMOVE CURRENT SAME-TYPE OUTFIT ===
        const existingEntry = OutfitButton.selectedOutfits[outfitType];
        const currentOutfit = existingEntry?.current;

        if (!alreadyUnequipped && this.displayedOutfit || currentOutfit) {
            // Remove visuals
            if (this.displayedOutfit) {
                this.displayedOutfit.destroy();
                this.displayedOutfit = null;
            }

            if (currentOutfit?.displayedOutfit) {
                currentOutfit.displayedOutfit.destroy();
            }

            // Subtract stat of old ONLY if not already done
            if (currentOutfit?.stat) {
                this.statTracker.setStat(currentOutfit.stat, false);
            }

            // Save to previous
            OutfitButton.selectedOutfits[outfitType] = {
                current: null,
                previous: currentOutfit
            };

            return; // Stop here if unequipping
        }

        // === 4. EQUIP NEW OUTFIT ===
        const offset = outfitManualOffsets[textureAnime] || { x: 0, y: 0 };
        const finalX = outfitX + offset.x;
        const finalY = outfitY + offset.y;

        const image = scene.add.image(finalX, finalY, textureAnime);

        if (outfitCustomSizes[textureAnime]) {
            const { width, height } = outfitCustomSizes[textureAnime];
            image.setDisplaySize(width, height);
        } else {
            image.setScale(0.6);
        }

        this.displayedOutfit = image;
        this.displayedOutfit.setDepth(depthValues[outfitType] || 1);

        // Add new stat
        this.statTracker.setStat(stat, true);

        OutfitButton.selectedOutfits[outfitType] = {
            previous: existingEntry?.current || null,
            current: this
        };

        // Offset calculation
        this.offsetX = finalX - scene.player.x;
        this.offsetY = finalY - scene.player.y;
    }

    // Method to tween the outfit to follow the player's new position
    tweenOutfit(playerX, playerY, duration, ease) {
        if (this.displayedOutfit) {
            const newX = playerX + this.offsetX;
            const newY = playerY + this.offsetY;
            this.scene.tweens.add({
                targets: this.displayedOutfit,
                x: newX,
                y: newY,
                duration: duration,
                ease: ease
            });
        }
    }
}


