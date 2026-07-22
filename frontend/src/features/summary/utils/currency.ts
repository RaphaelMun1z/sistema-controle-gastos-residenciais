const currencyFormatter = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

export const formatCurrency = (value: number) =>
	currencyFormatter.format(value);

export const formatNegativeCurrency = (value: number) =>
	currencyFormatter.format(-Math.abs(value));
