import { Result, ValueObject, ValueObjectConfig } from "../base";
import { Text } from "./text.vo";

export interface AddressProps {
	street: string;
	number: string;
	complement: string;
	neighborhood: string;
	city: string;
	state: string;
	zip: string;
	country: string;
}

export class Address extends ValueObject<AddressProps, ValueObjectConfig> {
	private constructor(value: AddressProps, config?: ValueObjectConfig) {
		super(value, config);
	}

	public static create(
		value: AddressProps,
		config?: ValueObjectConfig,
	): Address {
		const result = Address.tryCreate(value, config);
		result.throwIfFailed();
		return result.instance;
	}

	public static tryCreate(
		value: AddressProps,
		config?: ValueObjectConfig,
	): Result<Address> {
		const street = Text.tryCreate(value.street, {
			minLength: 1,
			maxLength: 255,
		});

		const city = Text.tryCreate(value.city, {
			minLength: 1,
			maxLength: 100,
		});

		const state = Text.tryCreate(value.state, {
			minLength: 2,
			maxLength: 2,
		});

		const zip = Text.tryCreate(value.zip, {
			minLength: 5,
			maxLength: 20,
		});

		const country = Text.tryCreate(value.country, {
			minLength: 2,
			maxLength: 100,
		});

		const attrs = Result.combine<any>([street, city, state, zip, country]);

		if (attrs.isFailure) {
			return Result.fail(attrs.errors!);
		}

		return Result.ok(
			new Address(
				{
					street: street.instance.value,
					number: value.number || "",
					complement: value.complement || "",
					neighborhood: value.neighborhood || "",
					city: city.instance.value,
					state: state.instance.value,
					zip: zip.instance.value,
					country: country.instance.value,
				},
				config,
			),
		);
	}

	get street(): string {
		return this.value.street;
	}

	get number(): string {
		return this.value.number;
	}

	get complement(): string {
		return this.value.complement;
	}

	get neighborhood(): string {
		return this.value.neighborhood;
	}

	get city(): string {
		return this.value.city;
	}

	get state(): string {
		return this.value.state;
	}

	get zip(): string {
		return this.value.zip;
	}

	get country(): string {
		return this.value.country;
	}

	get shortLabel(): string {
		const parts = [this.value.city, this.value.state].filter(Boolean);
		if (parts.length === 0) return "—";
		return parts.join(" - ");
	}

	public static formatShort(address: {
		city: string;
		state: string;
	}): string {
		const parts = [address.city, address.state].filter(Boolean);
		if (parts.length === 0) return "—";
		return parts.join(" - ");
	}
}
