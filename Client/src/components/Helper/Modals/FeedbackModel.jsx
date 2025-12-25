import React, { useState } from 'react'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@heroui/react";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { changeFeedBack, submitFeedback } from '../../../store/slices/userSlice';

const Feedback = ({isOpen , onOpenChange , requestType,setData}) => {
  const [feed , setFeed]=useState({
    feedback:''
  });

  

  const dispatch = useDispatch();
  const handleChange=(e)=>{
    const {name , value}=e.target;
    setFeed((prev)=>({...prev, [name]:value}))
  }

  const isFormComplete = feed.feedback.trim() !== '' && feed.feedback.length >= 10;

  const handleFeedBack = async()=>{
    const feedBackSubmission = await dispatch(submitFeedback({disasterType:requestType.disasterType , feedBack:feed.feedback , deliveredId:requestType.deliveredId}))
    if(feedBackSubmission.status===200){
        await dispatch(changeFeedBack({status:false}))
      setData((prev)=>!prev);
    }
    setFeed({
      feedback:''
    })
  }

  return (
    <>
    <Modal size='5xl' radius='sm' backdrop='blur' scrollBehavior='inside' placement='center' isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent >
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">FeedBack</ModalHeader>
              <ModalBody >
                <div className='h-full w-[40%] mx-auto'>
                    <div  className=' flex items-center justify-center flex-col gap-4'>
                       <Textarea variant='flat' radius='sm' color='success' labelPlacement='outside' size='md' label="Your feedback" type='text' isRequired name="feedback" value={feed.feedback} onChange={handleChange} errorMessage={feed.feedback.length < 10 ? "Feedback must be at least 10 characters long" : null} />
                        
                <Button size='md' variant='shadow' color='success' radius='sm' className='w-[50%] flex items-center justify-center' onClick={handleFeedBack} onPress={onClose} isDisabled={!isFormComplete}>SUBMIT</Button>
                        
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

export default Feedback