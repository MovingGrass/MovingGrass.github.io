export default class UIButton {
    constructor(scene, x, y, textureButton, textureIcon, callback) {
        this.scene = scene; // Store scene reference

        // Create the button and icon using the scene
        this.button = scene.add.image(0, 0, textureButton).setInteractive().setDisplaySize(30, 30);
        this.icon = scene.add.image(0, 0, textureIcon);
        this.container = scene.add.container(x, y, [this.button, this.icon]).setScale(4);

        // Add hover effects
        this.button.on("pointerover", () => this.button.setAlpha(0.7));
        this.button.on("pointerout", () => this.button.setAlpha(1));

        // Click event
        this.button.on("pointerdown", () => {
            if (callback) callback();
        });
    }
}

export class OutfitButton {
    static selectedOutfits = {}; //to store currently selected outfits

    constructor(scene, name, outfitType,  x, y, outfitX, outfitY, textureAnime, textureButton, textureIcon) {
        this.scene = scene; // Store scene reference
        this.textureAnime = textureAnime; // Store anime texture reference

        // Create the button and icon using the scene
        this.button = scene.add.image(0, 0, textureButton).setInteractive().setDisplaySize(150, 200);
        this.icon = scene.add.image(0, 0, textureIcon);
        this.container = scene.add.container(x, y, [this.button, this.icon]);

        // Add hover effects
        this.button.on("pointerover", () => this.button.setAlpha(0.7));
        this.button.on("pointerout", () => this.button.setAlpha(1));

        // Click event
        this.button.on("pointerdown", () => {
            this.toggleOutfit(outfitX, outfitY, outfitType);
        });


    }
   toggleOutfit(outfitX, outfitY, outfitType) {
    const { scene, textureAnime } = this;

    const depthValues = {
       "Socks": 1,
       "Shoes": 2,
       "Underwear": 3,
       "Shirt": 4,
       "Dress": 5
    };
    // If selecting a Dress, remove all other outfits that aren't a Dress
    if (outfitType === "Dress" || outfitType === "Uniform") {
        if (OutfitButton.selectedOutfits["Shirt"]) {
            OutfitButton.selectedOutfits["Shirt"].destroy();
            delete OutfitButton.selectedOutfits["Shirt"];
        }
        if (OutfitButton.selectedOutfits["Underwear"]) {
            OutfitButton.selectedOutfits["Underwear"].destroy();
            delete OutfitButton.selectedOutfits["Underwear"];
        }
         if (OutfitButton.selectedOutfits["Socks"]) {
            OutfitButton.selectedOutfits["Socks"].destroy();
            delete OutfitButton.selectedOutfits["Socks"];
        }
    } else if (OutfitButton.selectedOutfits["Dress"]) {
        // If wearing a dress and selecting a new shirt or pants, remove the dress
        OutfitButton.selectedOutfits["Dress"].destroy();
        delete OutfitButton.selectedOutfits["Dress"];
    }

    // If this outfit was already selected, remove it
    if (this.displayedOutfit || OutfitButton.selectedOutfits[outfitType]) {
        this.displayedOutfit.destroy();
        this.displayedOutfit = null;
        delete OutfitButton.selectedOutfits[outfitType];
    } else {
        // Otherwise, display this outfit
        this.displayedOutfit = scene.add.image(outfitX, outfitY, textureAnime).setScale(0.6);
         this.displayedOutfit.setDepth(depthValues[outfitType] || 1);
        OutfitButton.selectedOutfits[outfitType] = this.displayedOutfit;
    }
}


}