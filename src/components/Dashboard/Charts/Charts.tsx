import { useEffect, useState } from "react";
import { isEmpty, capitalize } from "lodash";
import {
	Chart as ChartJS,
	BarElement,
	LineElement,
	CategoryScale, // x
	LinearScale, // y
	PointElement,
	Tooltip,
	Legend,
	Colors,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { ExcelData } from "../Dashboard";

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
}
interface ChartData {
	labels: (string | number)[];
	datasets: {
		label: string;
		data: (string | number)[];
		tension?: number;
	}[];
}

const Charts = ({ excelData, type }: Props) => {
	const [chartData, setChartData] = useState({} as ChartData);
	const options = {
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
			datasets: { label: string; data: (string | number)[] }[];
		} = {
			labels,
			datasets: [],
		};

		legends.forEach((legend: string, idx: number) => {
			chartData.datasets.push({
				label: legend,
				data: dataPoints[idx],
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
	}, [excelData]);

	return (
		<div className="h-[400px] w-full">
			{!isEmpty(chartData) &&
				(type === "line" ? (
					<Line data={chartData} options={options} />
				) : (
					<Bar data={chartData} options={options} />
				))}
		</div>
	);
};

export default Charts;