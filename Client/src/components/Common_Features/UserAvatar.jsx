import {Badge, Avatar} from "@heroui/react";
import  logo from '../../assets/Logo.png'
export const CheckIcon = ({size, height, width, ...props}) => {
  return (
    <svg
      fill="none"
      height={size || height || 18}
      viewBox="0 0 24 24"
      width={size || width || 18}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.75 11.9999L10.58 14.8299L16.25 9.16992"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

const UserAvatar = ( {...props})=>{
    return (
        <>
        {/* <Badge isOneChar color="success" content={<CheckIcon />} placement="bottom-right"> */}
        <Avatar
          className='object-cover rounded-sm'
          
          src={props.img}
          style={{ width: `${props.width}px`, height: `${props.height}px ` }}
        />
      {/* </Badge> */}
        </>
    )
}
export default UserAvatar