import {useCheckbox, Chip, VisuallyHidden, tv} from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { toggleHelp } from "../../store/slices/userSlice";
import { changeHelp, getPendingTask } from "../../ConnectContract/Web3Connection";
import { useAccount } from "wagmi";

export const CheckIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
};

export default function ToggleHelp() {
      const { help } = useSelector((state) => state.user);
const {address} = useAccount()
const wallet = address;
  const {children, isSelected, isFocusVisible, getBaseProps, getLabelProps, getInputProps} =
    useCheckbox({
      defaultSelected: help,
    });

    const dispatch = useDispatch();

    const handleHelp = async (status) => {
      await dispatch(toggleHelp({ helpEnabled: status }));
      const raw = await getPendingTask(address);
      if (raw.length > 0) {
        console.log(status)
         await changeHelp([status, wallet], address);
      }
    };
  

  const checkbox = tv({
    slots: {
      base: "border-default hover:bg-default-200",
      content: "text-default-500",
    },
    variants: {
      isSelected: {
        true: {
          base: "border-success bg-success hover:bg-danger-600 hover:border-primary-500",
          content: "text-primary-foreground pl-1",
        },
      },
      isFocusVisible: {
        true: {
          base: "outline-solid outline-transparent ring-2 ring-focus ring-offset-2 ring-offset-background",
        },
      },
    },
  });

  const styles = checkbox({isSelected, isFocusVisible});

  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Chip
      onClick={() => handleHelp(!isSelected)}
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        color="secondary"
        startContent={isSelected ? <CheckIcon className="ml-1" /> : null}
        variant="solid"
         {...getLabelProps()}
      >
        {children ? children : isSelected ? "Help Enabled" : "Help Disabled"}
      </Chip>
    </label>
  );
}
