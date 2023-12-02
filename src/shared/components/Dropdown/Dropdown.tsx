import { useRef, useState } from "react";
import { PiCaretUpBold, PiCaretDownBold } from "react-icons/pi";
import useClickOutside from "../../hooks/useClickOutside";

interface Props {
	value: string | number;
	items: { id: string; name: string }[];
	onSelectItem: (item: string) => void;
}

const Dropdown = ({ value, items, onSelectItem }: Props) => {
	const [showOptions, setShowOptions] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	// Hide the options when clicked outside or on it
	useClickOutside(dropdownRef, () => setShowOptions(false));

	const extractOption = () => items.find((item) => item?.id === value)?.name;

	return (
		<div className="relative min-w-[15rem] max-w-[15rem] disabled:pointer-events-none">
			<div
				className="flex items-center gap-6 outline outline-1 outline-gray-200 rounded-md bg-white px-3 py-2 cursor-pointer focus:outline-gray-400"
				onClick={() => setShowOptions((prev) => !prev)}
				ref={dropdownRef}
			>
				<p className="grow">{extractOption() ?? "Select a value"}</p>
				{showOptions ? <PiCaretUpBold /> : <PiCaretDownBold />}
			</div>
			{showOptions && (
				<div className="bg-white absolute top-[2.8rem] z-10 w-full drop-shadow-md rounded-md py-2">
					{items?.length ? (
						items?.map((item) => (
							<p
								key={item?.id}
								className="py-2 px-3 hover:bg-gray-200 cursor-pointer text-sm"
								onClick={() => onSelectItem(item?.id)}
							>
								{item?.name}
							</p>
						))
					) : (
						<p className="py-2 px-3 text-sm">No options</p>
					)}
				</div>
			)}
		</div>
	);
};

export default Dropdown;
