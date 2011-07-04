var data = require("self").data;
var addon_worker = null;

if (typeof window == 'undefined') {
	window = require("timers");
}

eval(data.load("common.js"));
eval(data.load("dao.js"));

var send_update = function(users) {
	if (addon_worker == null) {
		console.log("Worker is null, can't do anything yet.");
		return;
	}

	addon_worker.port.emit("user_update", users);
}

var initialize = function(worker) {
	addon_worker = worker;

	addon_worker.port.on('force_refresh', function() {
		do_update();
	});

	do_update();
}

var pageMod = require("page-mod");
pageMod.PageMod({
	include: ['*'],
	contentScriptFile: [ data.url('common.js'), data.url('dao.js'), data.url('contentscript.js') ],
	onAttach: function(worker) {
		initialize(worker);
	}
});

console.log("The add-on is running.");
