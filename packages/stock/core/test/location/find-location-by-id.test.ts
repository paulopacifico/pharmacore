import { Location } from "../../src";
import { FindLocationById } from "../../src/location/usecase/find-location-by-id.usecase";
import { MockLocationRepository } from "../data/mock-location-repo";

describe("FindLocationById", () => {
  let usecase: FindLocationById;
  let repository: MockLocationRepository;

  beforeEach(() => {
    repository = new MockLocationRepository();
    usecase = new FindLocationById(repository);
  });

  it("should return a location by id successfully", async () => {
    const location = Location.create({
      name: "Main Warehouse",
      address: "123 Main St",
      isActive: true,
    });

    await repository.create(location);

    const result = await usecase.execute({ id: location.id });

    expect(result.isOk).toBe(true);
    expect(result.instance).toBeInstanceOf(Location);
    expect(result.instance?.id).toBe(location.id);
  });

  it("should fail if location does not exist", async () => {
    const result = await usecase.execute({ id: "non-existent-id" });

    expect(result.isFailure).toBe(true);
  });
});
