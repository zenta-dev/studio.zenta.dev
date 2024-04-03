import Combobox from './combobox.svelte';
import FormCombobox from './form-combobox.svelte';

export interface FormItem {
	id: string;
}

export type FormItemsArray = [FormItem, ...FormItem[]];

export { Combobox, FormCombobox };
