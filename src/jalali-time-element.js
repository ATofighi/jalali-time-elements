var jalaliTimeElementOffset = 0;

function jalaliTimeElements() {
	var momentLocal = moment.locale();
	moment.locale('fa');
	var $elements = document.getElementsByTagName('time');
	for (var elementItem = 0; elementItem < $elements.length; elementItem++) {
		var $element = $elements[elementItem];
		if ($element.hasAttribute('data-default')) {
			$element.innerHTML = $element.getAttribute('data-default');
		}
		else {
			$element.setAttribute('data-default', $element.innerHTML);
		}
		var datetime = moment($element.getAttribute('datetime'), 'YYYY-MM-DD[T]HH:mm:ssZ');
		if (!datetime.isValid()) {
			throw Error('time: datetime attribute is not valid');
		}


		var format = '';

		if ($element.getAttribute('day') == 'long') {
			format += 'jD ';
		}
		else {
			format += 'jDD ';
		}

		if ($element.getAttribute('month') == 'long') {
			format += 'jMMMM ';
		}
		else {
			format += 'jMMM ';
		}

		if ($element.getAttribute('year') == '2-digit') {
			format += 'jYY, ';
		}
		else {
			format += 'jYYYY, ';
		}

		if ($element.getAttribute('hour') == 'numeric') {
			format += 'H:';
		}
		else {
			format += 'HH:';
		}

		if ($element.getAttribute('minute') == 'numeric') {
			format += 'm';
		}
		else {
			format += 'mm';
		}


		if ($element.getAttribute('is') == 'local-time') {
			$element.innerHTML = moment(datetime).format(format);
		}
		else if ($element.getAttribute('is') == 'time-ago' || ($element.getAttribute('is') == 'relative-time' && moment().add(jalaliTimeElementOffset, 'ms').add(-30, 'days').diff(datetime) <= 0 )) {
			$element.setAttribute('title', moment(datetime).format(format));

			if ($element.getAttribute('format') == 'micro') {
				if (typeof console.warn != 'undefined') {
					console.warn('there is no micro format for jalali date')
				}
				else {
					console.log('Warning: there is no micro format for jalali date')
				}
			}

			$element.innerHTML = moment(datetime).from(moment().add(jalaliTimeElementOffset, 'ms'));
		}
		else if ($element.getAttribute('is') == 'relative-time') {
			$element.setAttribute('title', moment(datetime).format(format));
			// nothing
		}
		else {
			throw Error('time: is attribute is not valid');
		}
	}
	moment.locale(momentLocal);

	setTimeout(jalaliTimeElements, 15000);
}

window.addEventListener('load', function () {
	if (document.getElementById('time-element-now') && moment(document.getElementById('time-element-now').getAttribute('content'), 'YYYY-MM-DD[T]HH:mm:ssZ').isValid()) {
		jalaliTimeElementOffset = -1 * moment().diff(moment(document.getElementById('time-element-now').getAttribute('content'), 'YYYY-MM-DD[T]HH:mm:ssZ'));
	}
	jalaliTimeElements();
});