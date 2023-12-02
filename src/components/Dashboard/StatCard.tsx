import { cx } from "../../shared/utils/classHelper";

interface Props {
	label: string;
	stats: string;
	icon: React.ReactNode;
	accentClasses: string;
}

const StatCard = ({ label, stats, icon, accentClasses }: Props) => {
	return (
		<div className="bg-white min-w-sm p-4 rounded-md shadow-sm relative min-h-fit overflow-hidden">
			<div
				className={cx(
					"flex justify-between h-fit items-start gap-10 before:absolute before:h-2/5 before:w-2 before:inline-block before:left-0 before:top-0 overflow-hidden mb-5",
					accentClasses
				)}
			>
				<p className="text-lg font-medium pl-3">{label}</p>
				<p>{icon}</p>
			</div>
			<p className="text-5xl p-5 text-center">
				{stats} <span className="text-base">watts</span>
			</p>
		</div>
	);
};

export default StatCard;
