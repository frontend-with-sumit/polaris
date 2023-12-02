import React from "react";
import { cx } from "../../utils/classHelper";

const List = ({
	className = "",
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return <div className={cx("h-fit", className)}>{children}</div>;
};

export default List;
