import { Location } from "../../src/location/model/location.entity";

describe("Location Entity", () => {
  it("should create a location with valid data", () => {
    const props = {
      name: "Main Warehouse",
      address: "123 Industrial Ave",
      isActive: true,
    };
    const locationResult = Location.tryCreate(props);

    expect(locationResult.isOk).toBe(true);
    const location = locationResult.instance;

    expect(location).toBeInstanceOf(Location);
    expect(location.name).toBe(props.name);
    expect(location.address).toBe(props.address);
    expect(location.isActive).toBe(props.isActive);
    expect(location.id).toBeDefined();
    expect(location.createdAt).toBeInstanceOf(Date);
  });

  it("should fail to create a location with an invalid name", () => {
    const props = {
      name: "",
      address: "456 Commercial St",
      isActive: true,
    };
    const locationResult = Location.tryCreate(props);

    expect(locationResult.isFailure).toBe(true);
  });

  it("should correctly clone a location with new values", () => {
    const initialProps = {
      name: "Old Location",
      address: "Old Address",
      isActive: true,
    };
    const location = Location.create(initialProps);

    const newName = "New Location";
    const result = location.cloneWith({ name: newName });
    expect(result.isOk).toBeTruthy();
    const newLocation = result.instance;

    console.log(newLocation);

    expect(newLocation.name).toBe(newName);
    expect(newLocation.address).toBe(initialProps.address);
    expect(newLocation.id).toBe(location.id);
  });
});
