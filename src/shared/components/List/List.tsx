import React from "react";
import { cx } from "../../utils/classHelper";

const List = ({
	className = "",
	children,
	onScroll,
}: {
	className?: string;
	onScroll?: React.UIEventHandler<HTMLDivElement>;
	children: React.ReactNode;
}) => {
	return (
		<div className={cx("h-fit", className)} onScroll={onScroll}>
			{children}
		</div>
	);
};

export default List;
