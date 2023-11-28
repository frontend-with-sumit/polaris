import { cx } from "../../utils/classHelper";
import "./Switch.css";

interface Props {
	className?: string;
	isChecked: boolean;
	leftLabel: React.ReactNode | string;
	rightLabel: React.ReactNode | string;
	onChange: () => void;
}

const Switch = ({
	className = "",
	isChecked,
	leftLabel,
	rightLabel,
	onChange,
}: Props) => {
	return (
		<div className={cx("flex gap-5 ", className)}>
			{leftLabel}
			<label className="toggle-switch">
				<input
					type="checkbox"
					className="toggle-switch-checkbox"
					checked={isChecked}
					onChange={onChange}
					hidden
				/>
				<span className="toggle-switch-slider"></span>
			</label>
			{rightLabel}
		</div>
	);
};

export default Switch;
