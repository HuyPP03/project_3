// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VehicleRegistration is ERC721URIStorage, Ownable {
    uint256 private tokenIdCounter;

    // Cục Cảnh Sát -> Phòng Cảnh Sát Cấp Tỉnh/Thành Phố
    mapping(address => bool) public provincialPolice;

    // Phòng Cảnh Sát -> Cảnh Sát Cấp Quận/Huyện
    mapping(address => mapping(address => bool)) public districtPolice;

    address[] private provinces;

    // Lưu danh sách các quận/huyện của từng tỉnh
    mapping(address => address[]) private districtsByProvince;

    // Lưu biển số xe và tokenId tương ứng
    mapping(string => uint256) private numberPlateToTokenId;

    event ProvincePoliceAdded(address indexed province);
    event ProvincePoliceRemoved(address indexed province);
    event DistrictPoliceAdded(
        address indexed province,
        address indexed district
    );
    event DistrictPoliceRemoved(
        address indexed province,
        address indexed district
    );
    event RegisterVehicle(
        uint256 indexed tokenId,
        string numberPlate,
        address indexed createdBy
    );

    modifier onlyProvincialPolice() {
        require(provincialPolice[msg.sender], "Not a provincial police.");
        _;
    }

    modifier onlyDistrictPolice() {
        bool isDistrict;
        for (uint i = 0; i < provinces.length; i++) {
            if (
                provincialPolice[provinces[i]] &&
                districtPolice[provinces[i]][msg.sender]
            ) isDistrict = true;
        }
        require(isDistrict, "Not a valid district police.");
        _;
    }

    constructor() ERC721("VehicleRegistration", "VEHICLE") Ownable(msg.sender) {
        tokenIdCounter = 1;
    }

    // Cục Cảnh Sát Giao Thông: Thêm Phòng Cảnh Sát Cấp Tỉnh/Thành Phố
    function addProvincialPolice(address province) external onlyOwner {
        require(!provincialPolice[province], "Province already exists.");
        provincialPolice[province] = true;
        provinces.push(province);
        emit ProvincePoliceAdded(province);
    }

    // Cục Cảnh Sát Giao Thông: Xoá Phòng Cảnh Sát Cấp Tỉnh/Thành Phố
    function removeProvincialPolice(address province) external onlyOwner {
        require(provincialPolice[province], "Province not registered.");

        // Xóa tất cả các quận/huyện thuộc tỉnh
        address[] memory districts = districtsByProvince[province];

        for (uint256 i = 0; i < provinces.length; i++) {
            if (provinces[i] == province) {
                provinces[i] = provinces[provinces.length - 1];
                provinces.pop();
                break;
            }
        }
        for (uint256 i = 0; i < districts.length; i++) {
            districtPolice[province][districts[i]] = false;
        }

        // Xóa tỉnh
        provincialPolice[province] = false;
        delete districtsByProvince[province];

        emit ProvincePoliceRemoved(province);
    }

    // Phòng Cảnh Sát Cấp Tỉnh/Thành Phố: Thêm Cảnh Sát Cấp Quận/Huyện
    function addDistrictPolice(address district) external onlyProvincialPolice {
        require(
            !districtPolice[msg.sender][district],
            "District already exists."
        );
        districtPolice[msg.sender][district] = true;
        districtsByProvince[msg.sender].push(district);

        emit DistrictPoliceAdded(msg.sender, district);
    }

    // Phòng Cảnh Sát Cấp Tỉnh/Thành Phố: Xoá Cảnh Sát Cấp Quận/Huyện
    function removeDistrictPolice(
        address district
    ) external onlyProvincialPolice {
        require(districtPolice[msg.sender][district], "District not found.");
        districtPolice[msg.sender][district] = false;

        // Xóa khỏi danh sách
        address[] storage districts = districtsByProvince[msg.sender];
        for (uint256 i = 0; i < districts.length; i++) {
            if (districts[i] == district) {
                districts[i] = districts[districts.length - 1];
                districts.pop();
                break;
            }
        }

        emit DistrictPoliceRemoved(msg.sender, district);
    }

    // Cảnh Sát Cấp Quận/Huyện: Tạo NFT đăng ký xe
    function registerVehicle(
        address owner,
        string memory tokenURI,
        string memory numberPlate // Biển số xe
    ) external onlyDistrictPolice {
        require(
            numberPlateToTokenId[numberPlate] == 0,
            "Number plate already registered."
        );

        uint256 newTokenId = tokenIdCounter;
        tokenIdCounter++;

        _safeMint(owner, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        // Lưu biển số xe
        numberPlateToTokenId[numberPlate] = newTokenId;

        emit RegisterVehicle(newTokenId, numberPlate, msg.sender);
    }

    function getProvinces() public view onlyOwner returns (address[] memory) {
        return provinces;
    }

    // Lấy danh sách các quận/huyện của một tỉnh
    function getDistricts() public view returns (address[] memory) {
        require(provincialPolice[msg.sender], "Not must province");
        return districtsByProvince[msg.sender];
    }

    // Kiểm tra cấp của một địa chỉ
    function checkAuthorityLevel() public view returns (string memory) {
        if (msg.sender == owner()) {
            return "OWNER";
        }

        if (provincialPolice[msg.sender]) {
            return "PROVINCE";
        }

        for (uint256 i = 0; i < provinces.length; i++) {
            if (districtPolice[provinces[i]][msg.sender]) {
                return "DISTRICT";
            }
        }

        return "USER";
    }

    // Tìm kiếm biển số để lấy ra URI của biển số đó
    function getURIByNumberPlate(
        string memory licensePlate
    ) public view returns (string memory, address, uint256) {
        uint256 tokenId = numberPlateToTokenId[licensePlate];
        require(tokenId != 0, "Number plate not found.");
        return (tokenURI(tokenId), ownerOf(tokenId), tokenId);
    }
}
