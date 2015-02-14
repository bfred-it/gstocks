//Icon: http://owencm.deviantart.com/art/Google-Finance-Icon-353405528
function getEl (classes, tag) {
	tag = tag || 'div';
	var el = document.createElement(tag);
	el.className = classes;
	return el;
}
function getFrame (name) {
	var wrapper = getEl('Stock');
	name = name.toUpperCase();
	wrapper.innerHTML =  '<iframe scrolling="no" src="https://'+document.location.host+'/search?q='+name+'+stock" class="Stock-frame"></iframe>';
	return wrapper;
}
function appendStock (name) {
	var stock = getFrame(name);
	gs.appendChild(stock);
}
function rememberStock (name) {
	var settings = getSettings();
	settings.list.push(name);
	saveSettings(settings);
}
function getSettings () {
	var settings = localStorage.getItem('gstocks');
	if (settings) {
		return JSON.parse(settings);
	}
	//defaults
	return {
		list: ['aapl','msft','tsla']
	};
}
function saveSettings (settings) {
	localStorage.setItem('gstocks', JSON.stringify(settings));
}

//init
var gs = getEl('GS');
document.documentElement.insertBefore(gs, document.documentElement.firstChild);

//load settings
var settings = getSettings();
settings.list.forEach(appendStock);

//load ui
var sets = getEl('Settings');
gs.appendChild(sets);

//add stock input
var add = getEl('Settings-add', 'input');
sets.appendChild(add);

var getAdd = function () {
	var stock = this.value.trim();
	if (stock) {
		rememberStock(stock);
		appendStock(stock);
	}
	this.value = '';
};
add.placeholder = '+';
add.addEventListener('blur', getAdd);
add.addEventListener('keydown', function (event) {
	if(event.keyCode == 13){
		getAdd.call(this);
	}
});

//edit list
var edit = getEl('Settings-edit', 'textarea');
sets.appendChild(edit);

edit.addEventListener('focus', function () {
	var settings = getSettings();
	this.value = settings.list.join(',');
});
edit.addEventListener('blur', function () {
	var settings = getSettings();
	if (this.value !== settings.list.join(',')) {//if it has changed
		//update settings
		settings.list = this.value.split(',').filter(function (stock) {
			stock = stock.trim();
			if (stock) {
				return stock;
			}
		});
		saveSettings(settings);

		//replace old with new in the view
		[].forEach.call(document.querySelectorAll('.Stock'), function (oldStock) {
			oldStock.remove();
		});
		settings.list.forEach(appendStock);
	}
	this.value = '';
});


