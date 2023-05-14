export interface IInputField {
	label: string;
	id: string;
	value: string;
	handleChange?: Function | any;
}

export default function InputField({
	label,
	id,
	value,
	handleChange,
}: IInputField) {
	return (
		<section className="relative mb-4 input-section">
			<input
				type="text"
				placeholder={label}
				id={id}
				name={id}
				value={value}
				onChange={handleChange}
			/>
			<label
				htmlFor={id}
				className="absolute top-0 left-0 items-center flex cursor-text"
			>
				{label}
			</label>
		</section>
	);
}
