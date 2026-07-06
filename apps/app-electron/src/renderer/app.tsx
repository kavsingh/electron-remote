import { usePrefersDark } from "design-system/hooks";
import { useEffect } from "react";

function App() {
	const prefersDark = usePrefersDark();

	useEffect(() => {
		document.documentElement.classList.toggle("dark", prefersDark);
	}, [prefersDark]);

	return (
		<>
			<div className="grid place-items-center overflow-hidden bg-background block-full inline-full">
				Failed to load the app. Please check the console for more information.
			</div>
			<div className="fixed inset-x-0 inset-bs-0 z-10 [-webkit-app-region:drag] block-8" />
		</>
	);
}

export { App };
