import React, { useState } from 'react'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { donateCrypto } from '../../../../ConnectContract/Web3Connection';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAgent, fetchNGO } from '../../../../store/slices/authSlice';

const DigitalTransfer = ({ isOpen, onOpenChange, donateCoin, setData }) => {
  const { address } = useAccount();
  const [ethamount, setEthAmount] = useState({
    ETH: ''
  });
  const { _id: userId, role } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEthAmount((prev) => ({ ...prev, [name]: value }))
  }

  const isFormComplete = Object.values(ethamount).every(val => val.trim() !== '');
  const handlePay = async () => {

    try {
      let data = {};
      if (role == "ngo") {
        const ngoDetails = await dispatch(fetchNGO());

        data = {
          organizationName: ngoDetails.ngo_Name,
        }
      } else if (role == "gov_Agent") {
        const agentDetails = await dispatch(fetchAgent());

        data = {
          organizationName: agentDetails.name,
        }
      }
      const eth = parseEther(ethamount.ETH);
      const donate = await donateCrypto([donateCoin.requestId, data.organizationName, userId, donateCoin.role, donateCoin.donationType, address], address, eth)
      setEthAmount({
        ETH: ''
      })
      if (donate.status == 'success') {
        toast.success(' Successfully Donated')
        setData((prev) => !prev)
      }
    } catch (error) {
      toast.error(' Something went wrong')
    }
  }

  return (
    <>
      <Modal size='4xl' radius='sm' backdrop='blur' scrollBehavior='inside' placement='center' isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent >
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Payment Mode</ModalHeader>
              <ModalBody >
                <div className='h-full w-[40%] mx-auto'>
                  <div className=' flex items-center justify-center flex-col gap-4'>
                    <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='md' label="ETH" type="number" isRequired name="ETH" value={ethamount.ETH} onChange={handleChange} />
                    <Button size='md' variant='shadow' color='success' radius='sm' className='w-[50%] flex items-center justify-center' onClick={handlePay} onPress={onClose} isDisabled={isFormComplete}>Pay</Button>

                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {/* <Button color="primary" onPress={onClose}>
                  Action
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default DigitalTransfer