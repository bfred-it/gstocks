'use strict';
//Icon: http://owencm.deviantart.com/art/Google-Finance-Icon-353405528

var settings;
function getSettings (setting, index) {
	if (!settings) {
		//load stored
		settings = localStorage.getItem('gstocks');
		if (settings) {
			settings = JSON.parse(settings);
		} else {
			//defaults
			settings = {
				list: ['aapl','msft','tsla']
			};
		}
	}
	if (setting) {
		if (settings[setting]) {
			if (typeof index !== 'undefined') {
				if (settings[setting][index]) {
					return settings[setting][index];
				}
				return false;
			}
			return settings[setting];
		}
		return false;
	}
	return settings;
}
function saveSettings (name, index, value) {
	if (typeof name === 'object') {
		settings = name;
	} else if (typeof value === 'undefined') {
		settings[name] = index;
	} else {
		if (!settings[name]) {
			settings[name] = {};
		}
		settings[name][index] = value;
	}

	try {
		localStorage.setItem('gstocks', JSON.stringify(settings));
	} catch (e) {
		alert('I couldn\'t save your settings, there was an error. Open a new gstocks page and try again. Error code: ', + e.name + ': ' + e.message);
	}
}
function getEl (classes, tag) {
	tag = tag || 'div';
	var el = document.createElement(tag);
	el.className = classes;
	return el;
}
function getFrame (name) {
	var wrapper = getEl('Stock');
	name = name.toUpperCase();

	//show stock
	var frame = getEl('Stock-frame', 'iframe');
	frame.src = 'https://'+document.location.host+'/search?q='+name+'+stock';
	frame.scrolling = 'no';
	wrapper.appendChild(frame);

	//show notes
	var notes = getEl('Stock-notes');
	notes.innerText = getSettings('notes', name) || '';
	wrapper.appendChild(notes);

	//ready note input
	var notesField = getEl('Field Stock-notes-input', 'textarea');
	wrapper.appendChild(notesField);

	notesField.addEventListener('focus', function () {
		var notes = getSettings('notes', name) || '';
		notesField.value = notes;
	});
	notesField.addEventListener('blur', function () {
		//save settings
		saveSettings('notes', name, notesField.value);

		//update app
		notes.innerText = notesField.value;

		//empty field
		notesField.value = '';
	});
	return wrapper;
}


var gs = getEl('GS');
document.documentElement.insertBefore(gs, document.documentElement.firstChild);
function appendStock (name) {
	var stock = getFrame(name);
	gs.appendChild(stock);
}
function rememberStock (name) {
	var settings = getSettings();
	settings.list.push(name);
	saveSettings(settings);
}
(function () {
	//load list
	var list = getSettings('list');
	list.forEach(appendStock);

	//load ui
	var sets = getEl('Field Settings');
	gs.appendChild(sets);

	//add stock input
	var add = getEl('Field Settings-add', 'input');
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
		if(event.keyCode === 13){
			getAdd.call(this);
		}
	});

	//edit list
	var edit = getEl('Field Settings-edit', 'textarea');
	sets.appendChild(edit);

	edit.addEventListener('focus', function () {
		var list = getSettings('list')
		this.value = list.join(',');
	});
	edit.addEventListener('blur', function () {
		var list = getSettings('list');
		if (this.value !== list.join(',')) {//if it has changed
			//update settings
			list = this.value.split(',').filter(function (stock) {
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
			list.forEach(appendStock);
		}
		this.value = '';
	});
} ());
