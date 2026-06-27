import { THEME_SOURCES, themeSourceSchema } from "app-shared/common/theme";
import { Card } from "design-system/components";

import { ipcApi } from "~/rtk/services/ipc";

import type { ThemeSource } from "app-shared/common/theme";
import type { ChangeEventHandler, SubmitEventHandler } from "react";

function LabelText(props: { themeSource: ThemeSource }) {
	switch (props.themeSource) {
		case "system":
			return "System";

		case "light":
			return "Light";

		case "dark":
			return "Dark";

		default:
			return props.themeSource;
	}
}

const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
	event.preventDefault();
};

export function ThemeSwitch() {
	const { data: themeSource } = ipcApi.useThemeSourceQuery();
	const [setThemeSource] = ipcApi.useSetThemeSourceMutation();

	const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		void setThemeSource(themeSourceSchema.parse(event.currentTarget.value));
	};

	return (
		<Card.Root>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<Card.Header>
						<Card.Title>
							<legend>Theme</legend>
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul className="flex gap-3">
							{THEME_SOURCES.map((option) => (
								<li className="flex items-center gap-1" key={option}>
									<input
										type="radio"
										id={option}
										name={option}
										value={option}
										checked={themeSource === option}
										onChange={handleChange}
										className="peer cursor-pointer block-4 inline-4"
									/>
									<label
										className="cursor-pointer text-muted-foreground transition-colors peer-checked:text-foreground"
										htmlFor={option}
									>
										<LabelText themeSource={option} />
									</label>
								</li>
							))}
						</ul>
					</Card.Content>
				</fieldset>
			</form>
		</Card.Root>
	);
}
