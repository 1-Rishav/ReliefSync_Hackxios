import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { toast } from 'react-toastify';
import { notifySubscriber } from '../../../store/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { linkOneSignalUser, logoutOneSignalUser } from '../../../OneSignalSetup/OneSignalProvider';
// import { useSelector } from 'react-redux'; // Not needed for toggle logic, but keep if you use it elsewhere

const NotificationModal = ({ isOpen, onOpenChange }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { _id: userId, role } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Safety Check: Ensure OneSignal is loaded
    window.OneSignalDeferred = window.OneSignalDeferred || [];

    window.OneSignalDeferred.push(function (OneSignal) {

      // A. Initial Check (No await needed here for the boolean)
      const currentStatus = OneSignal.User.PushSubscription.optedIn;
      setIsSubscribed(currentStatus);

      // B. Setup Event Listener for external changes (e.g. user changes browser settings)
      const handleChange = (event) => {
        setIsSubscribed(event.current.optedIn);
      };

      OneSignal.User.PushSubscription.addEventListener('change', handleChange);

      // Cleanup listener when modal unmounts
      return () => {
        OneSignal.User.PushSubscription.removeEventListener('change', handleChange);
      };
    });
  }, []); // Run once on mount

  const handleClick = async () => {
    setIsLoading(true);
    try {
      // We push the action into the Deferred array to ensure SDK is ready
      window.OneSignalDeferred.push(async function (OneSignal) {
        if (isSubscribed) {
          await OneSignal.User.PushSubscription.optOut();
          await logoutOneSignalUser();
          toast.info('Notifications disabled.');
        } else {
          // This triggers the Browser's native "Allow" prompt
          await OneSignal.User.PushSubscription.optIn();
          await linkOneSignalUser({ userId, role });
          setTimeout(async () => {
            await dispatch(notifySubscriber());
          }, 400);
          toast.success('Notifications enabled!');
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Toggle Error:', error);
      setIsLoading(false);
      toast.error("Something went wrong.");
    }
  };

  return (
    <Modal size='md' radius='sm' backdrop='blur' isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Notification Settings</ModalHeader>
            <ModalBody>
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  {isSubscribed
                    ? "You are all set! You will receive updates about your tasks."
                    : "Stay updated! Enable notifications to track your tasks instantly."}
                </p>

                <Button
                  onPress={handleClick} // Changed onClick to onPress for HeroUI
                  isLoading={isLoading}
                  color={isSubscribed ? "danger" : "primary"}
                  variant={isSubscribed ? "flat" : "solid"}
                  className="w-full"
                >
                  {isSubscribed ? "Disable Notifications" : "Enable Notifications"}
                </Button>

                {!isSubscribed && (
                  <p className="text-xs text-gray-500">
                    *Requires "Allow" permission in your browser.
                  </p>
                )}
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

export default NotificationModal;