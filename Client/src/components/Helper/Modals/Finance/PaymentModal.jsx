import React from 'react'
import { BsCurrencyRupee, BsCurrencyBitcoin } from "react-icons/bs";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

import DigitalTransfer from './DigitalTransfer';
import CurrencyTransfer from './CurrencyTransfer';



const PaymentModal = ({ isOpen, onOpenChange, donateData, resetData }) => {

  const { isOpen: digitalOpen, onOpen: onDigitalOpen, onOpenChange: openDigitalChange } = useDisclosure();
  const { isOpen: currencyOpen, onOpen: onCurrencyOpen, onOpenChange: openCurrencyChange } = useDisclosure();

  return (
    <>
      <Modal size='4xl' radius='sm' backdrop='blur' scrollBehavior='inside' placement='center' isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent >
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Payment Mode</ModalHeader>
              <ModalBody >
                <div className='h-full w-full'>
                  <div className='flex items-center justify-around gap-2'>
                    <Button onPress={onClose} onClick={() => onCurrencyOpen()} color='success' variant='flat' className='  cursor-pointer flex items-center justify-center  hover:bg-green-200  flex-col h-32 w-36 border-2 rounded-lg bg-neutral-200' ><BsCurrencyRupee size={60} /><span className='text-xl font-medium'>Currency</span></Button>

                    <Button onPress={onClose} onClick={() => onDigitalOpen()} color='success' variant='flat' className='  cursor-pointer flex items-center justify-center  hover:bg-green-200  flex-col h-32 w-36 border-2 rounded-lg bg-neutral-200' ><BsCurrencyBitcoin size={60} /><span className='text-xl font-medium'>Digital Coin</span></Button>

                  </div>
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
      <DigitalTransfer isOpen={digitalOpen} onOpenChange={openDigitalChange} donateCoin={donateData} setData={resetData} />
      <CurrencyTransfer isOpen={currencyOpen} onOpenChange={openCurrencyChange} donateCoin={donateData} setData={resetData} />
    </>
  )
}

export default PaymentModal