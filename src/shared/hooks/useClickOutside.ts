/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

const useClickOutside = <T extends HTMLElement>(
	ref: React.RefObject<T>,
	callback: () => void
) => {
	const handleClick = (event: MouseEvent) => {
		if (ref.current && !ref.current.contains(event.target as Node)) {
			callback();
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => handleClick(event);

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [callback, ref]);
};

export default useClickOutside;
