import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from "@heroui/react";

 import androidVideo from '../../assets/Android.mp4';
import desktopVideo from '../../assets/desktop.mp4';

const WalletConnect = ({ isOpen, onOpenChange }) => {

  const [selectedDevice, setSelectedDevice] = useState("desktop");

  // Video source based on selection
  const videoMap = {
    mobile: androidVideo,
    ios: androidVideo,
    desktop: desktopVideo
  };

  return (
    <Modal size='md' radius='sm' backdrop='blur' className='relative z-500' isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Connect Wallet</ModalHeader>

            <ModalBody>
              <div className="text-center space-y-4">

                <p className="text-sm text-gray-600">
                  Connect your wallet to manage your assets securely
                </p>

                {/* --------- DEVICE SELECT CHIPS --------- */}
                <div className="flex justify-center gap-3">
                  
                  <Chip
                    variant={selectedDevice === 'mobile' ? 'dot' : 'bordered'}
                    color={selectedDevice === 'mobile' ? 'success' : 'default'}
                    onClick={() => setSelectedDevice('mobile')}
                    className="cursor-pointer"
                  >
                    Android
                  </Chip>

                  <Chip
                    variant={selectedDevice === 'ios' ? 'dot' : 'bordered'}
                    color={selectedDevice === 'ios' ? 'success' : 'default'}
                    onClick={() => setSelectedDevice('ios')}
                    className="cursor-pointer"
                  >
                    iOS
                  </Chip>

                  <Chip
                    variant={selectedDevice === 'desktop' ? 'dot' : 'bordered'}
                    color={selectedDevice === 'desktop' ? 'success' : 'default'}
                    onClick={() => setSelectedDevice('desktop')}
                    className="cursor-pointer"
                  >
                    Desktop
                  </Chip>

                </div>

                {/* --------- VIDEO --------- */}
                <video
                  src={videoMap[selectedDevice]}
                  className={`${selectedDevice==='desktop' ? 'w-[70%] h-[150px] rounded-xl border-5 border-green-200 flex mx-auto object-contain' : 'w-[40%] h-[300px] rounded-xl border-5 border-green-200 flex mx-auto object-contain'}`}
                  muted
                  loop
                  autoPlay
                  preload="auto"
                ></video>

              </div>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default WalletConnect;
