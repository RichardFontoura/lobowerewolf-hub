class LoboWerewolfHub {
    static registeredTools = [];
    
    static init() {
        console.log(game.i18n.localize("Werewolf.Initializing"));
        
        Hooks.on('getSceneControlButtons', this._getSceneControlButtons.bind(this));   
        game.lobowerewolfHub = {
            registerTool: this.registerTool.bind(this)
        };
    }
    
    /**
     * @param {Array} controls 
     */
    static _getSceneControlButtons(controls) {
        controls.push({
            name: "lobowerewolfhub",
            title: game.i18n.localize("Werewolf.HubTitle"),
            icon: "fa-brands fa-wolf-pack-battalion",
            layer: "controls",
            tools: this.registeredTools
        });
    }
    
    /**
     * @param {Object} toolData 
     * @returns {Boolean} 
     */
    static registerTool(toolData) {
        if (!toolData || !toolData.name || !toolData.title || !toolData.icon) {
            console.error(game.i18n.localize("Werewolf.ToolRegisterError"), toolData);
            return false;
        }
        
        this.registeredTools.push(toolData);
        console.log(game.i18n.format("Werewolf.ToolRegistered", {name: toolData.name}));
        return true;
    }
}

Hooks.once('init', () => {
    LoboWerewolfHub.init();
});
