import React, { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { AiOutlineScan } from "react-icons/ai";
import {jwtDecode} from 'jwt-decode';
import { toast } from "react-toastify";

export function ScanQr({DecodedId}) {
  const [scanning, setScanning] = useState(false);
  const qrCodeRegionId = "qr-reader";
  const html5QrCodeRef = useRef(null);

  const startScan =async () => {
    if (scanning) return;

    try {
      html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);

      await html5QrCodeRef.current.start(
        { facingMode: "environment" }, // rear camera
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
            const decodedToken = jwtDecode(decodedText);
          // Extract requestId
          const requestId = decodedToken?.id ;
          DecodedId(requestId);
          // Stop scan immediately after first success
          await stopScan();
        },
        (err) => {
          // ignore scan errors (happens if no QR found per frame)
        }
      );

      setScanning(true);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const stopScan = async () => {
    try {
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
        setScanning(false);
        toast.success("QR Code scanned successfully!");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <button
        onClick={startScan}
        className="p-2 text-2xl flex items-center gap-2"
      >
        <AiOutlineScan size={60} className="text-green-500 font-bold text-2xl"/>
      </button>

      <div id={qrCodeRegionId} style={{ width: "200px", marginTop: "10px" }} />
    </div>
  );
}
