import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { IoSettingsSharp, IoHelpCircle } from "react-icons/io5";

interface Item {
	id: number;
	label: string;
	path: string;
	icon: React.ReactNode;
}

const ITEMS: Item[] = [
	{
		id: 1,
		label: "Dashboard",
		path: "/visualize",
		icon: <MdSpaceDashboard size={26} />,
	},
	{
		id: 2,
		label: "Settings",
		path: "",
		icon: <IoSettingsSharp size={26} />,
	},
	{
		id: 3,
		label: "Support",
		path: "",
		icon: <IoHelpCircle size={26} />,
	},
];

const Sidebar = () => {
	const navigate = useNavigate();
	const [activeItem, setActiveItem] = useState<number>(0);

	return (
		<aside className="bg-white w-[300px] text-center py-10 shadow-sm">
			<ul className="flex flex-col items-start w-full">
				{ITEMS.map((item) => (
					<li
						key={item?.id}
						className={`w-full relative`}
						onClick={() => {
							navigate(item?.path);
							setActiveItem(item?.id);
						}}
					>
						<div
							className={`flex items-center gap-3 text-left text-lg font-medium cursor-pointer px-20 py-6 hover:bg-slate-100 ${
								activeItem === item?.id
									? "bg-slate-100 font-semibold after:absolute after:bg-violet-500 after:h-full after:w-2 after:inline-block after:right-0"
									: ""
							}`}
						>
							{item?.icon}
							{item?.label}
						</div>
					</li>
				))}
			</ul>
		</aside>
	);
};

export default Sidebar;
