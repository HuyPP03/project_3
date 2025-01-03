import { useState } from "react";

interface Props {
  data: {
    address: string;
    brand: string;
    capacity: string;
    chassis_No: string;
    color: string;
    created_date: string;
    date_of_expiry: string;
    engine_No: string;
    model_code: string;
    number: string;
    number_plate: string;
    rate_power: string;
    signer: string;
    type: string;
    goods: string | null;
    weight: number | null;
    height: number | null;
    sit: number | null;
    lie: string | null;
    stand: string | null;
  };
}

const Car = ({ data }: Props) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex flex-col items-center my-8">
      <div
        className={`h-[280px] w-[400px] [perspective:1000px] cursor-pointer`}
        onClick={handleFlip}
      >
        <div
          className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front Side */}
          <div className="absolute inset-0 p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 [backface-visibility:hidden]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-blue-800 font-bold text-lg uppercase">
                  Giấy đăng ký xe
                </h2>
                <p className="text-blue-600 text-sm">
                  Vehicle Registration Certificate
                </p>
              </div>
              <div className="w-16 h-16 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold">
                VN
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600 text-xs">
                  Biển số xe / Number plate
                </p>
                <p className="font-bold text-lg">{data.number_plate}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Nhãn hiệu / Brand</p>
                <p className="font-semibold">{data.brand}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-xs">Số máy / Engine No.</p>
                <p className="font-mono">{data.engine_No}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Số khung / Chassis No.</p>
                <p className="font-mono">{data.chassis_No}</p>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex justify-between text-xs text-gray-500">
              <p>Ngày cấp: {data.created_date}</p>
              <p>Số: {data.number}</p>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 p-6 rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-xs">Loại xe / Type</p>
                  <p className="font-semibold">{data.type}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Màu sơn / Color</p>
                  <p className="font-semibold">{data.color}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-xs">Công suất / Power</p>
                  <p className="font-semibold">{data.rate_power}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Dung tích / Capacity</p>
                  <p className="font-semibold">{data.capacity}</p>
                </div>
              </div>

              {data.weight && (
                <div>
                  <p className="text-gray-600 text-xs">Tải trọng / Weight</p>
                  <p className="font-semibold">{data.weight} kg</p>
                </div>
              )}

              {data.height && (
                <div>
                  <p className="text-gray-600 text-xs">Chiều cao / Height</p>
                  <p className="font-semibold">{data.height} m</p>
                </div>
              )}

              {data.lie && (
                <div>
                  <p className="text-gray-600 text-xs">Nằm / Lie</p>
                  <p className="font-semibold">{data.lie}</p>
                </div>
              )}

              {data.stand && (
                <div>
                  <p className="text-gray-600 text-xs">Đứng / Stand</p>
                  <p className="font-semibold">{data.stand}</p>
                </div>
              )}

              {data.goods && (
                <div>
                  <p className="text-gray-600 text-xs">Hàng hóa / Goods</p>
                  <p className="font-semibold">{data.goods}</p>
                </div>
              )}

              {data.sit && (
                <div>
                  <p className="text-gray-600 text-xs">Ngồi / Sit</p>
                  <p className="font-semibold">{data.sit}</p>
                </div>
              )}

              <div className="mt-4">
                <p className="text-gray-600 text-xs">
                  Chữ ký số / Digital Signature
                </p>
                <p className="font-mono text-xs truncate">{data.signer}</p>
              </div>
            </div>

            <div className="absolute bottom-6 right-6">
              <div className="w-16 h-16 bg-white rounded-lg shadow flex items-center justify-center text-xs text-gray-400">
                QR Code
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-gray-500 text-sm">Click to flip the card</p>
    </div>
  );
};

export default Car;
