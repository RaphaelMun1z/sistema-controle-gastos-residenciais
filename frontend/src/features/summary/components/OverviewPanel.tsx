import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { formatCurrency, formatNegativeCurrency } from "../utils/currency";
import SignedAmount from "./SignedAmount";

interface OverviewPanelProps {
	totalRevenue: number;
	totalExpense: number;
	balance: number;
}

const OverviewPanel = ({
	totalRevenue,
	totalExpense,
	balance,
}: OverviewPanelProps) => {
	return (
		<section className="overview-section" aria-labelledby="overview-title">
			<h3 id="overview-title">Visão Geral</h3>

			<div className="overview-items">
				<div className="overview-item">
					<div className="overview-label">
						<TrendingUpIcon className="overview-icon income" />

						<div>
							<strong>Receitas</strong>
							<p>Total recebido</p>
						</div>
					</div>

					<span className="income-value">{formatCurrency(totalRevenue)}</span>
				</div>

				<div className="overview-item">
					<div className="overview-label">
						<TrendingDownIcon className="overview-icon expense" />

						<div>
							<strong>Despesas</strong>
							<p>Total gasto</p>
						</div>
					</div>

					<span className="expense-value">
						{formatNegativeCurrency(totalExpense)}
					</span>
				</div>

				<div className="overview-item">
					<div className="overview-label">
						<AccountBalanceWalletIcon className="overview-icon balance" />

						<div>
							<strong>Saldo</strong>
						</div>
					</div>

					<SignedAmount
						value={balance}
						className={
							balance >= 0 ? "positive-balance" : "negative-balance"
						}
					/>
				</div>
			</div>
		</section>
	);
};

export default OverviewPanel;
