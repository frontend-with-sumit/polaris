import React from "react";
import { cx } from "../../utils/classHelper";

const ListItem = ({
	className = "",
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<div
			className={cx(
				"px-4 flex items-center border-b-2 border-gray-50 hover:bg-gray-100 line-clamp-2 cursor-pointer relative",
				className
			)}
		>
			{children}
		</div>
	);
};

export default ListItem;
