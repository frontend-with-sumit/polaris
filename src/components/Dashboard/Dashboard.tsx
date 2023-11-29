import { ChangeEvent, useEffect, useRef, useState } from "react";
import moment, { Moment } from "moment";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { isEmpty } from "lodash";

import { GiPowerLightning } from "react-icons/gi";
import { MdElectricMeter } from "react-icons/md";
import { FaChartColumn, FaChartLine } from "react-icons/fa6";

import StatCard from "./StatCard";
import Charts from "./Charts/Charts";
import Form from "./FormFilter/Form.tsx";

import { formatNumber } from "../../shared/utils/formatNumber";
import Button from "../../shared/components/Button";
import Switch from "../../shared/components/Switch/Switch";

const renderStats = ({
	totalConsumption,
	clusterConsumption,
}: {
	totalConsumption: number;
	clusterConsumption: number;
}) => (
	<div className="flex gap-4">
		{/* FIXME: Replace the stats with actual data */}
		<StatCard
			label="Total power consumption"
			accentClasses="before:bg-accent-1"
			stats={formatNumber(totalConsumption)}
			icon={<GiPowerLightning size={24} className="text-accent-1" />}
		/>
		<StatCard
			label="Cluster meter consumption"
			accentClasses="before:bg-accent-2"
			stats={formatNumber(clusterConsumption)}
			icon={<MdElectricMeter size={24} className="text-accent-2" />}
		/>
	</div>
);

export interface ExcelData {
	[key: string]: (string | number)[];
}

interface Filters {
	from: Moment | string;
	to: Moment | string;
	meter: string;
}

const ALLOWED_FILES = ["text/csv"];

const Dashboard = () => {
	const [excelData, setExcelData] = useState({} as ExcelData);
	const [stats, setStats] = useState({
		totalConsumption: 0,
		clusterConsumption: 0,
	});
	const [isLineChart, setLineChart] = useState<boolean>(false);
	const [visibleDatasets, setVisibleDatasets] = useState<string[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			if (!ALLOWED_FILES.includes(file?.type))
				return toast.error("File is not supported");

			const arrayBuffer = await file.arrayBuffer();

			const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
				type: "array",
			});
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];

			const data = XLSX.utils.sheet_to_json(sheet, {
				header: 1,
			});

			const labels = data[0] as string[];
			const formattedLabels = labels.map((label) =>
				label
					.toLowerCase()
					.replace(/ \(watts\)/g, "")
					.replace(/ /g, "_")
			);
			const datasets = data.slice(1) as (string | number)[][];
			const formattedData: { [k: string]: (string | number)[] } = {
				timestamp: [],
				m1_power: [],
				m2_power: [],
				m3_power: [],
				m4_power: [],
				cluster_meter_power: [],
			};

			for (let i = 0; i < labels.length; i++) {
				for (let j = 0; j < datasets.length; j++) {
					formattedData[`${formattedLabels[i]}`].push(datasets[j][i]);
				}
			}

			setExcelData(formattedData);
		}
	};

	useEffect(() => {
		if (!isEmpty(excelData)) {
			// perform calculation for stats

			if (visibleDatasets.length === 0)
				setVisibleDatasets(Object.keys(excelData).slice(1));
		}
	}, [excelData]);

	const handleApplyFilter = ({ from, to, meter }: Filters) => {
		if (moment(from).isAfter(moment(to)))
			return toast.error("From date cannot be after to date");

		if (from && to) {
			const filteredExcelData = {};
			const fromIdx = excelData.timestamp.findIndex((ts) =>
				moment(ts, "DD/MM/YY HH:mm").isSameOrAfter(moment(from))
			);
			const toIdx = excelData.timestamp.findIndex((ts) =>
				moment(ts, "DD/MM/YY HH:mm").isSameOrAfter(moment(to))
			);

			const legends = Object.keys(excelData);
			legends.forEach((legend) => {
				filteredExcelData[legend] = excelData[legend].slice(fromIdx, toIdx + 1);
			});

			setExcelData(filteredExcelData);
		}

		// Only work when a meter is selected
		if (meter) setVisibleDatasets([meter]);
	};

	return (
		<section className="p-6 flex flex-col gap-6">
			{renderStats(stats)}
			<div className="flex flex-col gap-4">
				<h2 className="text-2xl font-semibold">Analytics</h2>
				{!isEmpty(excelData) && (
					<Form
						legends={Object.keys(excelData).slice(1)}
						onApply={(filters) => handleApplyFilter(filters)}
					/>
				)}
				<div className="bg-white p-6 rounded-md">
					{!isEmpty(excelData) ? (
						<div className="flex flex-col w-full h-fit">
							<Charts
								excelData={excelData}
								type={isLineChart ? "line" : ""}
								visibleDatasets={visibleDatasets}
							/>
							<Switch
								className="my-3 m-auto"
								isChecked={isLineChart}
								onChange={() => setLineChart((prev) => !prev)}
								leftLabel={
									<FaChartColumn
										size={26}
										className={
											!isLineChart ? "text-primary-500" : "text-gray-400"
										}
									/>
								}
								rightLabel={
									<FaChartLine
										size={24}
										className={`font-bold ${
											isLineChart ? "text-primary-500" : "text-gray-400"
										}`}
									/>
								}
							/>
						</div>
					) : (
						<div className="flex flex-col items-center gap-6 py-10">
							<p className="text-base text-center">
								To analyze and show your data we need a .csv file. Upload one
								using below button
							</p>
							<input
								ref={fileInputRef}
								type="file"
								accept="text/csv"
								onChange={handleFileChange}
								hidden
							/>
							<Button
								label="Upload CSV"
								className="text-sm outline outline-2 outline-primary-700 text-primary-700 px-4 py-2 rounded-md font-medium hover:bg-primary-50 active:bg-primary-100"
								onClick={() => fileInputRef && fileInputRef?.current?.click()}
							/>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default Dashboard;
