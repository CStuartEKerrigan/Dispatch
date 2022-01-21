

Hooks.on("init", () => {
    game.settings.register("wfrp4e-grail-chapel", "initialized", {
        name: "Initialization",
        scope: "world",
        config: false,
        default: false,
        type: Boolean
    });

    game.settings.registerMenu("wfrp4e-grail-chapel", "init-dialog", {
        name: "WFRP4e Ubersreik Grail Chapel",
        label: "Setup",
        hint: "Import or update the content for the Ubersreik Grail Chapel",
        type: WFRP4eGrailChapelInitWrapper,
        restricted: true
    })
})

Hooks.on("ready", () => {
    if (!game.settings.get("wfrp4e-grail-chapel", "initialized") && game.user.isGM) {
        new WFRP4eGrailChapelInitWrapper().render(true)
    }
})

class WFRP4eGrailChapelInitWrapper extends FormApplication {
    async render() {
		let html = "";
		try { html = await (await fetch("https://www.stuartkerrigan.com/fvtt/gc/init.php")).text()
		}
		catch (err){
			html = "<p>PHP Failure</p";
		}
        new game.wfrp4e.apps.ModuleInitializer("wfrp4e-grail-chapel", "WFRP4e Ubersreik Grail Chapel",html).render(true);
    }
}




/*
game.settings.set("wfrp4e-grail-chapel", "initialized", false);



Hooks.on("init", () => {
    // Register Advantage cap
    game.settings.register("wfrp4e-grail-chapel", "initialized", {
        name: "Initialization",
        scope: "world",
        config: false,
        default: false,
        type: Boolean
    });

    game.settings.registerMenu("wfrp4e-grail-chapel", "init-dialog", {
        name: "WFRP4e Grail Temple Initialization",
        label: "Initialize",
        hint: "Import or update the content from the WFRP4e Ubersreik Grail Chapel Module",
        type: WFRP4eGrailChapelWrapper,
        restricted: true
    })
})


Hooks.on("ready", () => {
    if (!game.settings.get("wfrp4e-grail-chapel", "initialized") && game.user.isGM)
    {
        new WFRP4eGrailChapelInitialization().render(true)
    } 
})

class WFRP4eGrailChapelWrapper extends FormApplication {
    render() {
		new WFRP4eGrailChapelInitialization().render(true);
	}
} 

class WFRP4eGrailChapelInitialization extends Dialog{

	constructor()
    {
        super({
			title: "WFRP4e Ubersreik Grail Chapel Initialization",
			content:  `<p class="notes"><img src="modules/wfrp4e-deadly-dispatch/assets/icons/logo.png" 
			style="display: block;  margin-left: auto;  margin-right: auto;">			
			
			</p>
			
			<p class="notes">Welcome to the Ubersreik Grail Chapel - a multilevel map for use in the Ubersreik Adventure II module Deadly Dispatch.<br/><br/>
			
			Pressing Initialize will install Actors and Scenes into your world and place map pins on the maps. <br/><br/>
			
			The scene requires the modules Better Roofs, Levels, Wall Heights and lib-wrapper, so please install and initilise this when asked.<br/><br/>

			Special thanks to: <b>Russell Thurman (Moo Man)</b><br/><br/>
            Foundry Edition by <b>Stuart Kerrigan</b><br/>
			
			You can email us at <a href="mailto:perilousrealmpodcast@gmail.com">perilousrealmpodcast@gmail.com</a>
			
			<p class="notes"><strong>Want to support us?</strong><br/><br/>
			
			This module is freeware, and always will be, and other free WFRP modules are planned. As the WFRP content now requires payment to Cubicle 7 there are some running costs so if you want to donate then the link below is provided.<br/><br/>
			
			<a href="https://paypal.me/perilousrealm?locale.x=en_GB"><img src="modules/wfrp4e-grail-chapel/paypal.png" style="display: block;  margin-left: auto; margin-right: auto;" alt="paypal" /></a><br/><br/>
			
			You can also listen to the <a href="https://anchor.fm/peril">Perilous Realm Podcast</a><br/><br/><a href="https://anchor.fm/peril"><img src="modules/wfrp4e-grail-chapel/peril.png" style="display: block;  margin-left: auto;  margin-right: auto;" alt="peril logo"></a> <br/><br/>Lastly do share with us at <a href="mailto:perilousrealmpodcast@gmail.com">perilousrealmpodcast@gmail.com</a> any streams or audio you have of your adventures in the Hooded Man Inn - if anyone is left to tell the tale.</p>`,

            buttons: {
	            initialize: {
	                label : "Initialize",
	                callback : async () => {
	                    game.settings.set("wfrp4e-grail-chapel", "initialized", true)
	                    await new WFRP4eGrailChapelInitialization().initialize()
	                    ui.notifications.notify("Initialization Complete")
						}
	                },
	                no: {
	                    label : "No",
	                    callback : () => {
    	                    game.settings.set("wfrp4e-grail-chapel", "initialized", true)
                            ui.notifications.notify("Skipped Initialization.")
                        }
                		}	
                	}
        })
		
        this.folders = {
            "Scene" : {},
            "Actor" : {}
        }		
        this.moduleKey = "wfrp4e-grail-chapel"		
    }
	
    async initialize() {
        return new Promise((resolve) => {
            fetch(`modules/${this.moduleKey}/initialization.json`).then(async r => r.json()).then(async json => {
                let createdFolders = await Folder.create(json)
                for (let folder of createdFolders)
                    this.folders[folder.data.type][folder.data.name] = folder;

                for (let folderType in this.folders) {
                    for (let folder in this.folders[folderType]) {

                        let parent = this.folders[folderType][folder].getFlag(this.moduleKey, "initialization-parent")
                        if (parent) {
                            let parentId = this.folders[folderType][parent].data._id
                            await this.folders[folderType][folder].update({ parent: parentId })
                        }
                    }
                }

                await this.initializeEntities()
               // await this.initializeScenes()
                resolve()
            })
        })
    }

    async initializeEntities() {

        let packList= [ `${this.moduleKey}.GrailActors`,
                        `${this.moduleKey}.GrailScenes`]
		
        for( let pack of packList)
        {
			console.log(pack);
            let content = await game.packs.get(pack).getDocuments();
            for (let entity of content)
            {
                let folder = entity.getFlag(this.moduleKey, "initialization-folder")
				
                if (folder){
				//	console.log(folder);
				//	console.log(game.folders.getName(folder));
                    entity.folder = game.folders.getName(folder);
					console.log(entity.data.folder);
				}
            }
            switch(content[0].documentName)
            {
                case "Actor": 
                    ui.notifications.notify("Initializing Actors")
                    await Actor.create(content.map(c => c.data))
                    break;
            }
        }
    }	
	

	
}*/