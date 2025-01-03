const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("RegistrationVehicle", function () {
  async function deployOneYearLockFixture() {
    const [owner, province, district, user1, user2] = await ethers.getSigners();

    const VehicleRegistration = await ethers.getContractFactory(
      "VehicleRegistration"
    );
    const vehicleRegistration = await VehicleRegistration.deploy();

    return { vehicleRegistration, owner, province, district, user1, user2 };
  }

  describe("Deployment", function () {
    it("ownerOfContract", async function () {
      const { vehicleRegistration, owner } = await loadFixture(
        deployOneYearLockFixture
      );
      const role = await vehicleRegistration
        .connect(owner)
        .checkAuthorityLevel();
      expect(await vehicleRegistration.owner()).to.equal(owner);
      expect(role).to.equal("OWNER");
    });
    it("addProvince", async function () {
      const { vehicleRegistration, owner, province } = await loadFixture(
        deployOneYearLockFixture
      );

      await vehicleRegistration.connect(owner).addProvincialPolice(province);
      const provinces = await vehicleRegistration.getProvinces();
      const role = await vehicleRegistration
        .connect(province)
        .checkAuthorityLevel();
      expect(provinces[0]).to.equal(province.address);
      expect(provinces.length).to.equal(1);
      expect(role).to.equal("PROVINCE");
    });
    it("removeProvince", async function () {
      const { vehicleRegistration, owner, province, district } =
        await loadFixture(deployOneYearLockFixture);

      await vehicleRegistration.connect(owner).addProvincialPolice(province);
      await vehicleRegistration.connect(province).addDistrictPolice(district);
      await vehicleRegistration.connect(owner).removeProvincialPolice(province);
      const provinces = await vehicleRegistration.getProvinces();
      expect(provinces.length).to.equal(0);
    });
    it("addDistrict", async function () {
      const { vehicleRegistration, owner, province, district } =
        await loadFixture(deployOneYearLockFixture);

      await vehicleRegistration.connect(owner).addProvincialPolice(province);
      await vehicleRegistration.connect(province).addDistrictPolice(district);
      const districts = await vehicleRegistration
        .connect(province)
        .getDistricts();
      const role = await vehicleRegistration
        .connect(district)
        .checkAuthorityLevel();
      expect(districts[0]).to.equal(district.address);
      expect(districts.length).to.equal(1);
      expect(role).to.equal("DISTRICT");
    });
    it("removeDistrict", async function () {
      const { vehicleRegistration, owner, province, district } =
        await loadFixture(deployOneYearLockFixture);

      await vehicleRegistration.connect(owner).addProvincialPolice(province);
      await vehicleRegistration.connect(province).addDistrictPolice(district);
      await vehicleRegistration
        .connect(province)
        .removeDistrictPolice(district);
      const districts = await vehicleRegistration
        .connect(province)
        .getDistricts();
      expect(districts.length).to.equal(0);
    });
    it("addVehicle", async function () {
      const { vehicleRegistration, owner, province, district, user1 } =
        await loadFixture(deployOneYearLockFixture);

      await vehicleRegistration.connect(owner).addProvincialPolice(province);
      await vehicleRegistration.connect(province).addDistrictPolice(district);
      await vehicleRegistration
        .connect(district)
        .registerVehicle(
          user1.address,
          "http://127.0.0.1:8080/ipfs/QmbsBn7ufCq8d5Myw22bLY4G1VVP7wff98xu2CfjkH6FXv",
          "51A12345"
        );
      const vehicle = await vehicleRegistration.getURIByNumberPlate("51A12345");
      expect(vehicle[0]).to.equal(
        "http://127.0.0.1:8080/ipfs/QmbsBn7ufCq8d5Myw22bLY4G1VVP7wff98xu2CfjkH6FXv"
      );
      expect(vehicle[1]).to.equal(user1.address);
    });
    it("transferVehicle", async function () {
      const { vehicleRegistration, owner, province, district, user1, user2 } =
        await loadFixture(deployOneYearLockFixture);

      await vehicleRegistration.connect(owner).addProvincialPolice(province);
      await vehicleRegistration.connect(province).addDistrictPolice(district);
      await vehicleRegistration
        .connect(district)
        .registerVehicle(
          user1.address,
          "http://127.0.0.1:8080/ipfs/QmbsBn7ufCq8d5Myw22bLY4G1VVP7wff98xu2CfjkH6FXv",
          "51A12345"
        );
      const vehicle = await vehicleRegistration.getURIByNumberPlate("51A12345");
      await vehicleRegistration
        .connect(user1)
        .safeTransferFrom(user1.address, user2.address, vehicle[2]);
      const vehicle2 = await vehicleRegistration.getURIByNumberPlate(
        "51A12345"
      );
      expect(vehicle2[1]).to.equal(user2.address);
    });
  });
});
