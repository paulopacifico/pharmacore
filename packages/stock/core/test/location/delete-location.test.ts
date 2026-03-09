import { DeleteLocation } from "../../src/location/usecase/delete-location.usecase";
import { MockLocationRepository } from "../data/mock-location-repo";
import { Location } from "../../src/location/model/location.entity";

describe("DeleteLocation", () => {
  let usecase: DeleteLocation;
  let repository: MockLocationRepository;

  beforeEach(() => {
    repository = new MockLocationRepository();
    usecase = new DeleteLocation(repository);
  });

  it("should delete a location successfully", async () => {
    const location = Location.create({
      name: "Main Warehouse",
      address: "123 Main St",
      isActive: true,
    });

    await repository.create(location);

    expect(repository.locations).toHaveLength(1);

    const result = await usecase.execute({ id: location.id });

    expect(result.isOk).toBe(true);
    expect(repository.locations).toHaveLength(0);
  });

  it("should fail if location does not exist", async () => {
    const result = await usecase.execute({ id: "non-existent-id" });

    expect(result.isFailure).toBe(true);
  });
});
