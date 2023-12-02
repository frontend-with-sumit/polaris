import { Moment } from "moment";
import Datetime from "react-datetime";
import { capitalize } from "lodash";
import "react-datetime/css/react-datetime.css";
import Dropdown from "../../../shared/components/Dropdown/Dropdown";
import { useState } from "react";
import Button from "../../../shared/components/Button";

interface FormFields {
	from: Moment | string;
	to: Moment | string;
	meter: string;
}
interface Props {
	legends: string[];
	onApply: (item: FormFields) => void;
}

const Form = ({ legends, onApply }: Props) => {
	const [form, setForm] = useState<FormFields>({
		from: "",
		to: "",
		meter: "",
	});

	return (
		<div className="flex gap-5 bg-white px-3 py-6 rouned-md">
			<Datetime
				className="w-fit"
				dateFormat="DD/MM/YY"
				timeFormat="HH:mm"
				inputProps={{
					placeholder: "from",
					className:
						"px-3 py-2 focus:drop-shadow-md focus:outline-2 focus:outline-primary-400 text-center outline outline-1 outline-gray-200 rounded-md",
				}}
				closeOnClickOutside
				onChange={(value: string | Moment) =>
					setForm((prev) => ({ ...prev, from: value }))
				}
			/>
			<Datetime
				className="w-fit"
				dateFormat="DD/MM/YY"
				timeFormat="HH:mm"
				inputProps={{
					placeholder: "to",
					className:
						"px-3 py-2 focus:drop-shadow-md focus:outline-2 focus:outline-primary-400 text-center outline outline-1 outline-gray-200 rounded-md",
				}}
				closeOnClickOutside
				onChange={(value: string | Moment) =>
					setForm((prev) => ({ ...prev, to: value }))
				}
			/>
			<Dropdown
				value={form?.meter}
				items={legends.map((legend: string) => ({
					id: legend,
					name: capitalize(legend.split("_").join(" ")),
				}))}
				onSelectItem={(item: string) =>
					setForm((prev) => ({ ...prev, meter: item }))
				}
			/>
			<Button
				label="Apply"
				className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 active:drop-shadow-md text-white"
				onClick={() => onApply(form)}
			/>
		</div>
	);
};

export default Form;
