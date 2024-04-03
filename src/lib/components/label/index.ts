import type { HTMLLabelAttributes } from 'svelte/elements';
import Root from './label.svelte';

type Props = ((HTMLLabelAttributes | undefined) | (HTMLLabelElement | undefined)) & {
	class?: string;
};
export { Root as Label, type Props as LabelProps };
