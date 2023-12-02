export const formatNumber = (value: number | bigint): string =>
	new Intl.NumberFormat().format(value);
