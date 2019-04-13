import React, { useEffect, useRef } from 'react';

export function FormGroup({ values, onUpdate, children }) {
	const ref = useRef();
	let domObserver = new MutationObserver(handleMutations);
	let domObserverConfig = {
		attributes: true,
		childList: true,
		subtree: true,
	};

	// console.log('FormGroup starting values = ', values);

	useEffect(() => {
		// console.log('useEffect setup...');
		setup();
		return teardown;
	}, [ref]);

	return (
		<div className="Component FormGroup" ref={ref}>
			{children}
		</div>
	);

	function setup() {
		hydrateForm(ref.current, values);
		setupForm(ref.current);
		domObserver.observe(ref.current, domObserverConfig);
	}

	function teardown() {
		teardownForm(ref.current);
		domObserver.disconnect();
	}

	function setupForm(group) {
		// console.log('setup', group);
		group.addEventListener('input', handleInput, false);
		// TODO: find out if change is required for IE/Edge
		// group.addEventListener('change', handleInput, false);
	}

	function teardownForm(group) {
		console.log('teardown', group);
		group.removeEventListener('input', handleInput, false);
		// TODO: find out if change is required for IE/Edge
		// group.removeEventListener('change', handleInput, false);
	}

	function reserialize() {
		return serializeForm(ref.current);
	}

	function handleInput(evt) {
		// console.log('handleInput evt', evt.type);
		// console.log('handleInput serial', serializeForm(ref.current));
		onUpdate(serializeForm(ref.current));
	}

	function handleMutations(mutationsList, observer) {
		for (const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				console.log('A child node has been added or removed.');
			} else if (mutation.type === 'attributes') {
				console.log(
					'The ' +
						mutation.attributeName +
						' attribute was modified.',
				);
			}
		}
	}

	function hydrateForm(group, values) {
		for (const name in values) {
			if (!values.hasOwnProperty(name)) {
				continue;
			}
			const el = group.querySelector(
				`input[name="${name}"], select[name="${name}"], textarea[name="${name}"]`,
			);
			if (el) {
				setFormInputValue(el, values[name]);
			}
		}
	}

	function serializeForm(group) {
		const inputsByName = {};
		const values = {};
		const inputs = group.querySelectorAll(`input, select, textarea`);
		for (const input of inputs) {
			inputsByName[input.name] = input;
		}
		for (const name in inputsByName) {
			if (!inputsByName.hasOwnProperty(name)) {
				continue;
			}
			values[name] = getFormInputValue(inputsByName[name]);
		}
		return values;
	}

	function getFormInputValue(el) {
		if (el.type === 'checkbox') {
			const checked = [];
			for (const cbox of getFormGroup(el)) {
				if (cbox.checked) {
					checked.push(cbox.value);
				}
			}
			return checked;
		} else if (el.type === 'radio') {
			for (const radio of getFormGroup(el)) {
				if (radio.checked) {
					return radio.value;
				}
			}
		} else if (el.tagName.toLowerCase() === 'select') {
			if (el.multiple) {
				const selected = [];
				for (const option of el.options) {
					if (option.selected) {
						selected.push(option.value);
					}
				}
				return selected;
			} else {
				for (const option of el.options) {
					if (option.selected) {
						return option.value;
					}
				}
			}
		}
		return el.value;
	}

	function setFormInputValue(el, value) {
		const valueIsArray = Array.isArray(value);
		if (el.type === 'checkbox') {
			// input type=checkbox
			for (const cbox of getFormGroup(el)) {
				cbox.checked = valueIsArray && value.includes(cbox.value);
			}
		} else if (el.type === 'radio') {
			// input type=radio
			for (const radio of getFormGroup(el)) {
				radio.checked = valueIsArray && String(value) === radio.value;
			}
		} else if (el.tagName.toLowerCase() === 'select') {
			if (el.multiple) {
				// select multiple
				for (const option of el.options) {
					option.selected =
						valueIsArray && value.includes(option.value);
				}
			} else {
				// select
				for (const option of el.options) {
					option.selected = String(value) === option.value;
				}
			}
		} else {
			// TODO: handle/ignore file inputs
			//
			// Other inputs: input[type=text], textarea
			el.value = value;
		}
	}

	function getFormGroup(el) {
		const name = el.name;
		return ref.current.querySelectorAll(
			`input[name="${name}"], select[name="${name}"], textarea[name="${name}"]`,
		);
	}
}
