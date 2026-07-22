import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import type { PersonFinancialSummary } from "../types/summary";
import { formatCurrency, formatNegativeCurrency } from "../utils/currency";
import SignedAmount from "./SignedAmount";

interface PersonSummaryCardProps {
	person: PersonFinancialSummary;
}

const PersonSummaryCard = ({ person }: PersonSummaryCardProps) => {
	return (
		<article className="person-summary">
			<header className="person-summary-header">
				<Avatar
					sx={{
						width: 30,
						height: 30,
						bgcolor: deepOrange[500],
						fontSize: "0.75rem",
					}}
				>
					{person.name.charAt(0)}
				</Avatar>
				<h2>{person.name}</h2>
			</header>

			<div className="summary-items">
				<div className="summary-item">
					<div className="summary-item-content">
						<div className="summary-icon income" aria-hidden="true">
							<TrendingUpIcon />
						</div>

						<div>
							<strong>Receitas</strong>
							<p>Total recebido</p>
						</div>
					</div>

					<span className="summary-value income-value">
						{formatCurrency(person.totalRevenue)}
					</span>
				</div>

				<div className="summary-item">
					<div className="summary-item-content">
						<div className="summary-icon expense" aria-hidden="true">
							<TrendingDownIcon />
						</div>

						<div>
							<strong>Despesas</strong>
							<p>Total gasto</p>
						</div>
					</div>

					<span className="summary-value expense-value">
						{formatNegativeCurrency(person.totalExpense)}
					</span>
				</div>

				<div className="summary-item">
					<div className="summary-item-content">
						<div className="summary-icon balance" aria-hidden="true">
							<AccountBalanceWalletIcon />
						</div>

						<div>
							<strong>Saldo</strong>
						</div>
					</div>

					<SignedAmount
						value={person.balance}
						className={`summary-value ${
							person.balance >= 0 ? "positive-balance" : "negative-balance"
						}`}
					/>
				</div>
			</div>
		</article>
	);
};

export default PersonSummaryCard;
