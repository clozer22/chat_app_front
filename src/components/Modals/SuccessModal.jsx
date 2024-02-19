import React, { useEffect, useState } from "react";
import '../../Fonts/fonts.css'
const SuccessModal = ({label}) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setShowAlert(true);

    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);
  return (
    <div
      className={`fixed top-2 right-0 transform transition-transform ${
        showAlert ? "-translate-x-0" : "translate-x-full"
      } w-full max-w-sm bg-white p-4 text-white duration-500 border-b-2 border-green-500 z-50`}
    >
      <div className="flex justify-between items-center">
        <div className="font-bold text-green-500 " style={{fontFamily: 'Curetro'}}>{label}</div>
        <div className="h-10 bg-green-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default SuccessModal;
