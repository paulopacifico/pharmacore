import {
    Address,
    AddressProps,
    Cnpj,
    Entity,
    EntityProps,
    Id,
    Name,
    Result,
} from "@pharmacore/shared";

export interface BranchProps extends EntityProps {
    name: string;
    cnpj: string;
    isActive: boolean;
    address: AddressProps;
    establishedAt?: Date | null;
}

export class Branch extends Entity<Branch, BranchProps> {
    private constructor(props: BranchProps) {
        super(props);
    }

    get name(): string {
        return this.props.name;
    }

    get cnpj(): string {
        return this.props.cnpj;
    }

    get isActive(): boolean {
        return this.props.isActive;
    }

    get address(): Address {
        return Address.create(this.props.address);
    }

    get establishedAt(): Date | null {
        return this.props.establishedAt ?? null;
    }

    public static create(props: BranchProps): Branch {
        const result = Branch.tryCreate(props);
        result.throwIfFailed();
        return result.instance;
    }

    static tryCreate(props: BranchProps): Result<Branch> {
        const id = Id.tryCreate(props.id);
        const name = Name.tryCreate(props.name);
        const cnpj = Cnpj.tryCreate(props.cnpj);
        const address = Address.tryCreate(props.address);

        const attrs = Result.combine<any>([id, name, cnpj, address]);
        if (attrs.isFailure) {
            return Result.fail(attrs.errors!);
        }

        return Result.ok(
            new Branch({
                ...props,
                id: id.instance.value,
                name: name.instance.value,
                cnpj: cnpj.instance.value,
                isActive: props.isActive,
                address: address.instance.value,
                establishedAt: props.establishedAt ?? null,
            }),
        );
    }
}
