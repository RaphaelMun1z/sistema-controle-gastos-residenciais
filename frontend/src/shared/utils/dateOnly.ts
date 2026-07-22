export const getTodayDateOnly = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
};

export const formatDateOnly = (dateOnly?: string) => {
	if (!dateOnly) {
		return "";
	}

	const [year, month, day] = dateOnly.split("-");

	if (!year || !month || !day) {
		return dateOnly;
	}

	return `${day}/${month}/${year}`;
};
