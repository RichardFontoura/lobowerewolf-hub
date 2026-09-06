# LoboWerewolf Hub

Install one LoboWerewolf module or install ten: they all share the same toolbar group, the
same button on the actor sheet and the same sidebar. That is what the Hub is for.

Foundry VTT v13 and up, verified on v14. Free.

## What it does

The Hub is a library module, so on its own it adds nothing to your game. What it gives you
is one predictable place for every LoboWerewolf module to put its interface, instead of
each one dropping a button somewhere in the toolbar and hoping for the best.

* **Scene Controls group.** A LoboWerewolf category (the paw icon) in the left toolbar,
  where any of the modules can register its tools.
* **Sheet Dock.** One LoboWerewolf button in the actor sheet header. Click it and you get
  a tray with the actions of every module you have installed, sorted into categories like
  Economy, Inventory and Crafting. Needs Hub 5.0.0 or newer.
* **Sidebar tabs.** Modules can add a tab of their own next to Foundry's.
* **About window.** An index of the LoboWerewolf modules, with versions and links.

## Installing

Most of the time you will not have to. Every LoboWerewolf module that needs the Hub
declares it as a required dependency, so Foundry offers to install it for you.

To do it by hand, go to **Add-on Modules**, then **Install Module**, and paste this in the
manifest field:

```
https://github.com/RichardFontoura/lobowerewolf-hub/releases/latest/download/module.json
```

Searching for **LoboWerewolf Hub** in Foundry's package browser works just as well.

## About this repository

This is where the releases live, together with the issue tracker and the documentation.
The source code is not here anymore. It moved to a private monorepo that keeps all the
LoboWerewolf modules in one place. Everything up to `4.0.1` was published under the ISC
licence and is still in this repository's git history. Version `5.0.0` and everything
after it are covered by the [LICENSE](LICENSE) file.

Something broken, or something missing? Open an
[issue](https://github.com/RichardFontoura/lobowerewolf-hub/issues).

## For module developers

### Declaring the dependency

In your `module.json`:

```json
{
  "relationships": {
    "requires": [
      {
        "id": "lobowerewolf-hub",
        "type": "module",
        "manifest": "https://github.com/RichardFontoura/lobowerewolf-hub/releases/latest/download/module.json",
        "compatibility": { "minimum": "5.0.0" }
      }
    ]
  }
}
```

Set `compatibility.minimum` to the oldest Hub version that has what you actually call. Use
`5.0.0` if you touch the Sheet Dock, `4.0.0` if you only register scene tools and sidebar
tabs.

### Reaching the API

The Hub publishes its API during its own `init` hook:

```js
const hub = game.modules.get("lobowerewolf-hub")?.api?.hub;
```

Register your entries from `ready`, or from an `init` handler that runs later. Always
guard the call: the user can disable the Hub even when your module lists it as required.

```js
Hooks.once("ready", () => {
  const hub = game.modules.get("lobowerewolf-hub")?.api?.hub;
  if (!hub) return; // degrade gracefully, never throw
  // register here
});
```

### Scene control tools, with `hub.setTool(tool)`

```js
hub.setTool({
  name: "my-module-open",       // required, unique
  title: "Open My Module",      // required, shown as the tooltip
  icon: "fas fa-scroll",        // required, Font Awesome class
  button: true,                 // true for a one-shot button, false for a stateful tool
  visible: true,                // pass this explicitly, see the note below
  order: 10,                    // optional, defaults to registration order
  onChange: () => myApp.render(true),
});
```

The Hub rejects a tool, and logs an error, unless it has `name`, `title`, `icon` and one of
`onChange` or `onClick`.

Two things that will bite you. Pass `visible: true` explicitly. And if you register after
an `await` inside `ready`, the toolbar has already been drawn, so call
`ui.controls.render({ reset: true })` afterwards or your tool stays invisible until
something else redraws it.

### Sidebar tabs, with `hub.setSidebarTab(tab)`

```js
hub.setSidebarTab({
  name: "my-module",                     // required, also becomes ui["my-module"]
  title: "My Module",                    // required, tooltip and aria-label
  icon: "fas fa-scroll",                 // required, Font Awesome class
  onRender: container => {               // required, receives the tab's <section>
    container.innerHTML = "<p>Hello</p>";
  },
});
```

`onRender` runs every time the tab is activated, so make it idempotent. Tabs registered
before `ready` are injected when the Hub sets up the sidebar. Register later than that and
the tab shows up right away.

### Sheet Dock, with `hub.sheetDock` (Hub 5.0.0 and up)

Puts an action in the LoboWerewolf tray on the actor sheet header, so your module does not
need a header button of its own.

```js
hub.sheetDock.register({
  id: "my-module.ledger",         // required, unique across all modules
  moduleId: "my-module",          // required, used when reporting errors
  label: "MY_MODULE.dock.ledger", // required, an i18n key or a plain string
  icon: "fas fa-book",            // required, Font Awesome class
  group: "economy",               // optional, defaults to "other"
  order: 10,                      // optional, ordering inside the group
  visible: actor => actor.isOwner,            // optional, defaults to always visible
  badge: actor => unreadCount(actor) || null, // optional, small counter on the entry
  onClick: actor => myApp.openFor(actor),     // required, may be async
});
```

The groups you can use are `economy`, `inventory`, `crafting`, `automation`, `narrative`,
`media`, `utilities`, `scenario`, `magic`, `minigames` and `other`. The Hub localises the
group headings. Your `label` goes through your own module's language files, so pass a
fully qualified key.

There is also `hub.sheetDock.unregister(id)`, `hub.sheetDock.getEntries()` and
`hub.sheetDock.open(actor)`. The last one opens the tray for an actor whose sheet is
already on screen.

### Versioning

The API above follows semantic versioning. New members bump the minor, removals and
signature changes bump the major. If you call something that arrived in a particular
release, raise `compatibility.minimum` to match. An older Hub will not complain, it will
just fail quietly when you register.

## Support

* Patreon: https://www.patreon.com/lobowerewolf
* Discord: https://discord.gg/Ttw59kWX4B
* Bugs and requests: https://github.com/RichardFontoura/lobowerewolf-hub/issues

## Licence

Free to use, all rights reserved. See [LICENSE](LICENSE).

Foundry Virtual Tabletop is a trademark of Foundry Gaming LLC. This module is independent
and has no affiliation with Foundry Gaming LLC.
