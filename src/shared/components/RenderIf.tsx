import React from "react";

interface Props {
	condition: boolean;
	children: React.ReactNode;
}

const RenderIf = ({ condition, children }: Props) => {
	return <>{condition ? children : ""}</>;
};

export default RenderIf;
