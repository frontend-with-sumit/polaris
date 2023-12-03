/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from "react";
import { isEmpty, capitalize } from "lodash";
import {
	Chart as ChartJS,
	BarElement,
	LineElement,
	CategoryScale,
	LinearScale,
	PointElement,
	Tooltip,
	Legend,
	Colors,
	Chart,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

import { ExcelData } from "../Dashboard";

import notificationCtx from "../../../shared/contexts/notificationContext";

ChartJS.register(
	LineElement,
	BarElement,
	CategoryScale,
	LinearScale,
	PointElement,
	Tooltip,
	Legend,
	Colors
);

interface Props {
	excelData: ExcelData;
	type: string;
	visibleDatasets: string[];
}
interface ChartData {
	labels: (string | number)[];
	datasets: {
		label: string;
		data: (string | number)[];
		tension?: number;
		hidden?: boolean;
	}[];
}

const Charts = ({ excelData, type, visibleDatasets }: Props) => {
	const notifCtx = useContext(notificationCtx);
	const [chartData, setChartData] = useState({} as ChartData);
	const lineRef = useRef<ChartJS<"line", number[], string>>(null);
	const barRef = useRef<ChartJS<"bar", number[], string>>(null);

	const options = {
		point: {
			radius: 5,
			borderRadius: 7,
		},
		responsive: true,
		plugins: {
			legend: {
				labels: {
					boxWidth: 10,
					boxHeight: 5,
				},
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						let label =
							capitalize(context.dataset.label.split("_").join(" ")) || "";

						if (label) {
							label = capitalize(label.split("_").join(" "));
							label += ": ";
						}
						if (context.parsed.y !== null) {
							label += context.parsed.y + "W";
						}
						return label;
					},
				},
			},
		},
	};

	const prepareChartData = (
		legends: string[],
		labels: (string | number)[],
		dataPoints: (string | number)[][]
	) => {
		const chartData: {
			labels: (string | number)[];
			datasets: {
				label: string;
				data: (string | number)[];
				tension?: number;
				hidden?: boolean;
				stack?: string;
			}[];
		} = {
			labels,
			datasets: [],
		};

		legends.forEach((legend: string, idx: number) => {
			chartData.datasets.push({
				label: legend,
				data: dataPoints[idx],
				tension: 0.4,
				hidden: !visibleDatasets.includes(legend),
				stack: "bar",
			});
		});

		return chartData;
	};

	useEffect(() => {
		if (!isEmpty(excelData)) {
			const legends = Object.keys(excelData).slice(1);
			const value = Object.values(excelData);

			const labels = value[0];
			const data = value.slice(1);

			const chartData = prepareChartData(legends, labels, data);

			setChartData(chartData);
		}
	}, [excelData, visibleDatasets]);

	useEffect(() => {
		if (notifCtx?.activeTimestamp) handleHighlightTimestamp();
	}, [notifCtx?.activeTimestamp]);

	const handleHighlightTimestamp = () => {
		let chartInstance: Chart | null = null;
		if (type === "line") chartInstance = lineRef.current;
		else chartInstance = barRef.current;

		if (chartInstance !== null && notifCtx) {
			const activeItems = chartData?.datasets.map((_, idx) => ({
				datasetIndex: idx,
				index: notifCtx?.activeTimestamp,
			}));

			chartInstance.setActiveElements(activeItems);

			chartData.datasets.forEach((_, idx) => {
				if (chartInstance)
					chartInstance.data.datasets[idx].hoverBackgroundColor = "red";
			});

			chartInstance.update();
		}
	};

	return (
		<div className="h-[400px] w-full">
			{!isEmpty(chartData) &&
				(type === "line" ? (
					<Line ref={lineRef} data={chartData} options={options} />
				) : (
					<Bar ref={barRef} data={chartData} options={options} />
				))}
		</div>
	);
};

export default Charts;
