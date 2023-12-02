import { cx } from "../utils/classHelper";

interface Props {
	label: string;
	className?: string;
	onClick: () => void;
	disabled?: boolean;
}

const Button = ({ label, className = "", onClick, disabled }: Props) => {
	return (
		<button
			className={cx("px-3 rounded-md text-sm", className)}
			onClick={onClick}
			disabled={disabled}
		>
			{label}
		</button>
	);
};

export default Button;
