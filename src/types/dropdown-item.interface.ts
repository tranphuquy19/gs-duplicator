export interface DropdownItem {
	text: string;
	fn: () => void | Promise<void>;
}
