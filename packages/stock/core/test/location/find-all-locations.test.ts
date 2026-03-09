import { MockLocationRepository } from "../data/mock-location-repo";
import { Location } from "../../src/location/model/location.entity";
import { FindAllLocations } from "../../src";

describe("FindAllLocations", () => {
  let usecase: FindAllLocations;
  let repository: MockLocationRepository;

  beforeEach(() => {
    repository = new MockLocationRepository();
    usecase = new FindAllLocations(repository);
  });

  it("should return an empty array if no locations exist", async () => {
    const result = await usecase.execute();

    expect(result.isOk).toBe(true);
    expect(result.instance).toHaveLength(0);
  });

  it("should return all existing locations", async () => {
    const location1 = Location.create({
      name: "Main Warehouse",
      address: "123 Main St",
      isActive: true,
    });
    const location2 = Location.create({
      name: "Secondary Warehouse",
      address: "456 Oak Ave",
      isActive: true,
    });

    await repository.create(location1);
    await repository.create(location2);

    const result = await usecase.execute();

    expect(result.isOk).toBe(true);
    expect(result.instance).toHaveLength(2);
    expect(result.instance?.[0]?.name).toBe("Main Warehouse");
    expect(result.instance?.[1]?.name).toBe("Secondary Warehouse");
  });
});
