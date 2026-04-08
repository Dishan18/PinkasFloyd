export function getDropdownTransition(isOpen: boolean): string {
	return `transition-all origin-top ${
		isOpen
			? "opacity-100 translate-y-0 ease-out duration-600 visible pointer-events-auto"
			: "opacity-0 -translate-y-4 ease-in duration-400 invisible pointer-events-none"
	}`;
}
