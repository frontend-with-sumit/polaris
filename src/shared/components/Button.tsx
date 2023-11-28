interface Props {
	label: string;
	className?: string;
	onClick: () => void;
	disabled?: boolean;
}

const Button = ({ label, className, onClick, disabled }: Props) => {
	return (
		<button className={className} onClick={onClick} disabled={disabled}>
			{label}
		</button>
	);
};

export default Button;
