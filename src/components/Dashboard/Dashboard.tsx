import { GiPowerLightning } from "react-icons/gi";
import { MdElectricMeter } from "react-icons/md";

import { formatNumber } from "../../shared/utils/formatNumber";
import StatCard from "./StatCard";
import LineChart from "./Charts/LineChart";

const renderStats = () => (
	<div className="flex gap-4">
		{/* FIXME: Replace the stats with actual data */}
		<StatCard
			label="Total power consumption by all meters"
			accentClasses="before:bg-accent-1"
			stats={formatNumber(10273)}
			icon={<GiPowerLightning size={24} className="text-accent-1" />}
		/>
		<StatCard
			label="Cluster meter consumption"
			accentClasses="before:bg-accent-2"
			stats={formatNumber(10273)}
			icon={<MdElectricMeter size={24} className="text-accent-2" />}
		/>
	</div>
);

const Dashboard = () => {
	return (
		<section className="p-6 flex flex-col gap-6">
			{renderStats()}
			<div>
				<h2 className="text-2xl font-semibold">Analytics</h2>
				<LineChart />
			</div>
		</section>
	);
};

export default Dashboard;
