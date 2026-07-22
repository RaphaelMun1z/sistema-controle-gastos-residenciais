import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import RemoveIcon from "@mui/icons-material/Remove";
import { formatCurrency } from "../utils/currency";

interface SignedAmountProps {
	value: number;
	className?: string;
	hideZeroIcon?: boolean;
}

const SignedAmount = ({
	value,
	className = "",
	hideZeroIcon = false,
}: SignedAmountProps) => {
	const isPositive = value > 0;
	const isNegative = value < 0;
	const iconClassName = `signed-amount__icon ${
		isPositive ? "positive" : isNegative ? "negative" : "neutral"
	}`;

	return (
		<span className={`signed-amount ${className}`.trim()}>
			{isPositive && <ArrowUpwardIcon className={iconClassName} />}
			{isNegative && <ArrowDownwardIcon className={iconClassName} />}
			{value === 0 && !hideZeroIcon && <RemoveIcon className={iconClassName} />}
			<span>{formatCurrency(value)}</span>
		</span>
	);
};

export default SignedAmount;
