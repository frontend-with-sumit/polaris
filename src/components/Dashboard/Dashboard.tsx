import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import moment, { Moment } from "moment";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { isEmpty, uniqueId, isEqual } from "lodash";

import { GiPowerLightning } from "react-icons/gi";
import { MdElectricMeter } from "react-icons/md";
import { FaChartColumn, FaChartLine } from "react-icons/fa6";

import StatCard from "./StatCard";
import Charts from "./Charts/Charts";
import Form from "./FormFilter/Form.tsx";
import { INotification } from "./Header/Notifications/Notification.tsx";

import { formatNumber } from "../../shared/utils/formatNumber";
import Button from "../../shared/components/Button";
import Switch from "../../shared/components/Switch/Switch";
import notificationCtx from "../../shared/contexts/notificationContext.ts";

const RenderStats = ({
	maxConsumption,
	maxLeakageCurrent,
}: {
	maxConsumption: number;
	maxLeakageCurrent: number;
}) => (
	<div className="flex gap-4">
		<StatCard
			label="Max Power consumption"
			accentClasses="before:bg-accent-1"
			stats={formatNumber(maxConsumption)}
			icon={<GiPowerLightning size={24} className="text-accent-1" />}
		/>
		<StatCard
			label="Max Leakage current till date"
			accentClasses="before:bg-accent-2"
			stats={formatNumber(maxLeakageCurrent)}
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
const VALID_COLS = [
	"Timestamp",
	"M1 Power (Watts)",
	"M2 Power (Watts)",
	"M3 Power (Watts)",
	"M4 Power (Watts)",
	"Cluster Meter Power (Watts)",
];

const Dashboard = () => {
	const notifCtx = useContext(notificationCtx);
	const [excelData, setExcelData] = useState({} as ExcelData);
	const [stats, setStats] = useState({
		maxConsumption: 0,
		maxLeakageCurrent: 0,
	});
	const [isLineChart, setLineChart] = useState<boolean>(false);
	const [visibleDatasets, setVisibleDatasets] = useState<string[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!isEmpty(excelData)) {
			generateAlertAndStats();
			if (visibleDatasets.length === 0)
				setVisibleDatasets(Object.keys(excelData).slice(1));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [excelData]);

	const readFile = async (file: File) => {
		const arrayBuffer = await file.arrayBuffer();

		const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
			type: "array",
		});
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];

		const data = XLSX.utils.sheet_to_json(sheet, {
			header: 1,
		});

		return data;
	};

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			if (!ALLOWED_FILES.includes(file?.type))
				return toast.error("File is not supported");

			const fileData = await readFile(file);

			const labels = fileData[0] as string[];
			if (!isEqual(labels, VALID_COLS)) {
				if (fileInputRef.current) fileInputRef.current.value = "";
				return toast.error("Invalid columns");
			}
			const formattedLabels = labels.map((label) =>
				label
					.toLowerCase()
					.replace(/ \(watts\)/g, "")
					.replace(/ /g, "_")
			);

			const datasets = fileData.slice(1) as (string | number)[][];
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

	const fetchTimestampIdx = (date: string | Moment) =>
		excelData.timestamp.findIndex((ts) =>
			moment(ts, "DD/MM/YY HH:mm").isSameOrAfter(moment(date))
		);

	const handleApplyFilter = ({ from, to, meter }: Filters) => {
		if (moment(from).isAfter(moment(to)))
			return toast.error("From date cannot be greater than date");

		if ((from && !to) || (!from && to))
			return toast.error("Please select both dates");

		if (from && to) {
			const filteredExcelData = {};
			const legends = Object.keys(excelData);

			const fromIdx =
				fetchTimestampIdx(from) !== -1 ? fetchTimestampIdx(from) : 0;
			const toIdx =
				fetchTimestampIdx(to) !== -1
					? fetchTimestampIdx(to)
					: excelData?.timestamp?.length;

			legends.forEach((legend) => {
				filteredExcelData[legend] = excelData[legend].slice(fromIdx, toIdx + 1);
			});

			setExcelData(filteredExcelData);
		}

		if (meter) setVisibleDatasets([meter]);
	};

	const generateAlertAndStats = () => {
		const notificationData: INotification[] = [];
		const MAX_POWER_CONSUMPTION_LIMIT = 1000;
		const MAX_LEAKAGE_LIMIT = 300;
		let maxConsumption = 0;
		let maxLeakageCurrent = 0;
		const {
			timestamp,
			m1_power,
			m2_power,
			m3_power,
			m4_power,
			cluster_meter_power,
		} = excelData;

		for (let i = 0; i < excelData?.m1_power?.length; i++) {
			const totalPower =
				+(m1_power[i] ?? 0) +
				+(m2_power[i] ?? 0) +
				+(m3_power[i] ?? 0) +
				+(m4_power[i] ?? 0);

			const leakageCurrent = Math.abs(
				+(cluster_meter_power[i] ?? 0) - totalPower
			);

			maxConsumption = Math.max(maxConsumption, totalPower);
			maxLeakageCurrent = Math.max(maxLeakageCurrent, leakageCurrent);

			if (totalPower >= MAX_POWER_CONSUMPTION_LIMIT) {
				notificationData.push({
					id: uniqueId(),
					description: "Total power consumption exceeds 1000 watts",
					timestamp: timestamp[i],
					timestampIdx: i,
					notification_category: "tpc",
					is_read: false,
				});
			}

			if (leakageCurrent >= MAX_LEAKAGE_LIMIT) {
				notificationData.push({
					id: uniqueId(),
					description:
						"Leakage current has exceeded the set limit of 300 watts",
					timestamp: timestamp[i],
					timestampIdx: i,
					notification_category: "lcurr",
					is_read: false,
				});
			}
		}

		setStats({
			maxConsumption,
			maxLeakageCurrent,
		});
		notifCtx?.updateNotifications(notificationData);
	};

	return (
		<section className="p-6 flex flex-col gap-6">
			<RenderStats
				maxConsumption={stats?.maxConsumption}
				maxLeakageCurrent={stats?.maxLeakageCurrent}
			/>

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
								className="mt-5 m-auto"
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
								To analyze and show your data we need a .csv file. Upload using
								below button
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
