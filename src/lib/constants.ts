export interface ComboboxInterface {
  photo?: string;
  value: string;
  label: string;
}
export const defaultFounderType: ComboboxInterface[] = [
  {
    value: "PERSON",
    label: "Person",
  },
  {
    value: "ORGANIZATION",
    label: "Organization",
  },
  {
    value: "COMPANY",
    label: "Company",
  },
] as const;
