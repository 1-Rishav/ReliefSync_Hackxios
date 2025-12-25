import React, { useEffect, useState } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
} from "@heroui/react";
import { donateFiat } from '../../../../ConnectContract/Web3Connection';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../../../utils/axios';
import { socket } from '../../ConnectSocket';
import { fetchAgent, fetchNGO } from '../../../../store/slices/authSlice';
import { notifyRequester } from '../../../../store/slices/userSlice';



const CurrencyTransfer = ({ isOpen, onOpenChange, donateCoin, setData }) => {
    const { address } = useAccount();
    const [donationId, setDonationId] = useState(null);
    const [orgName, setOrgName] = useState("");
    const [money, setMoney] = useState({
        amount: '',
    });

    const { _id: userId, role, firstName } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMoney((prev) => ({ ...prev, [name]: value }))
    }

    const isFormComplete = Object.values(money).every(val => val.trim() !== '');

    const handlePay = async () => {

        const moneyData = {
            amount: money.amount,
            needyName: donateCoin.name,
            needyUPI: donateCoin.upi
        }

        try {
            let organizationName = "";

            if (role === "ngo") {
                const ngoDetails = await dispatch(fetchNGO());
                organizationName = ngoDetails.ngo_Name;
            } else if (role === "gov_Agent") {
                const agentDetails = await dispatch(fetchAgent());
                organizationName = agentDetails.name;
            } else {
                organizationName = firstName;
            }

            setOrgName(organizationName);

            const response = await axios.post('donate/create-donation', moneyData, { withCredentials: true, headers: { "Content-Type": "application/json" } })
            console.log(response.data.paymentLink);
            if (response.data.success) {
                setDonationId(response.data.donationId);

                socket.emit("join_donation", response.data.donationId);

                window.location.href = response.data.paymentLink;
            } else {
                toast.error("Failed to create payment link");
            }
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        socket.connect();
        if (!donationId) return;

        socket.on("payment_update", async (msg) => {
            if (msg.donationId !== donationId) return;

            if (msg.status === "success") {

                const donate = await donateFiat([
                    donateCoin.requestId,
                    orgName,
                    userId,
                    donateCoin.role,
                    donateCoin.donationType,
                    msg.amount,
                    address,
                ], address);

                if (donate.status === "success") {
                    toast.success("Donated successfully!");
                    setData((prev) => !prev);
                    const notifyData = {
                        userId: donateCoin.userId,
                        title: 'ReliefSync - Transaction Successful',
                        message: `Transaction of ₹ ${msg.amount} successfully completed. You will receive the amount shortly.`,
                        allocatedBy: `${orgName}`,
                    }
                    await dispatch(notifyRequester(notifyData))
                } else {
                    toast.error("Donation failed");
                }
            }
        });

        return () => socket.off("payment_update");
    }, [donationId]);


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
                                        <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='md' label="Amount" type="number" isRequired name="amount" value={money.amount} onChange={handleChange} />
                                        <Button size='md' variant='shadow' color='success' radius='sm' className='w-[50%] flex items-center justify-center' onClick={handlePay} onPress={onClose} isDisabled={!isFormComplete}>Pay</Button>
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
        </>
    )
}

export default CurrencyTransfer