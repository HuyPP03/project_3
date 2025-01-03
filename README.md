# Smart contract
## Sử dụng hardhat
- Chạy lệnh để cài đặt các thư viện đã có: yarn.
- Để tạo ra file ABI run: npx hardhat compile.
- Để test smart contract run: npx hardhat test.
- Để deploy smart contract run: npx hardhat ignition deploy ./ignition/modules/RegisterVehicle.js --network sepolia. Với network sepolia là đang được deploy trên mạng sepolia.
- Sau khi deploy sẽ lưu lại address của hợp đồng và sử dụng file  VehicleRegistration.json để tạo Dapp.
# Data
- Tạo các data mẫu về motorcycle và car
- IPFS (InterPlanetary File System) là một giao thức và mạng lưu trữ phi tập trung được thiết kế để lưu trữ và chia sẻ dữ liệu theo cách phi tập trung, thay vì sử dụng các máy chủ tập trung truyền thống.
- IPFS daemon là một chương trình nền (background process) của IPFS, giúp máy của bạn trở thành một nút trong mạng IPFS.
- Sử dung: ipfs deamon để kết nối mạng ipfs sau đó tạo các file bằng cách ipfs add <tên file> => tạo ra id.
- Tên uri: http://127.0.0.1:8080/ipfs/<id>
# Front-end (react)
- Chạy lệnh để cài đặt các thư viện đã có: yarn.
- Thêm file .env dựa vào .env.example.
- Chạy dự án: yarn dev.