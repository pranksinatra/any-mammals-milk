class Utils {
	constructor() {
		// Cache window width and debounce updating
		this._windowWidth = window.innerWidth;
		window.addEventListener(
			'resize',
			this.debounce(() => {
				this._windowWidth = window.innerWidth;
			})
		);
	}

	get windowWidth() {
		return this._windowWidth;
	}

	debounce(func, wait = 50, immediate = false) {
		var timeout;
		return function() {
			var context = this,
				args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}

	shuffle(array) {
		var newArray = array.slice(),
			currentIndex = newArray.length,
			temporaryValue,
			randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = newArray[currentIndex];
			newArray[currentIndex] = newArray[randomIndex];
			newArray[randomIndex] = temporaryValue;
		}

		return newArray;
	}

}

export const utils = new Utils();