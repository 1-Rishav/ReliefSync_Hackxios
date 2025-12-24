import { readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core';
import  config  from '../rainbowKitConfig'; 
import { ForeCastABI,AidABI,ForeCastAddress,AidAddress } from './ConnectionAddress';



export const logForecast = async (args, account) => {
  try {
    const hash = await writeContract(config, {
      address: ForeCastAddress,
      abi: ForeCastABI,
      functionName: 'logForecast',
      args, 
      account,
    });

    const receipt = await waitForTransactionReceipt(config, { hash });
    return receipt;
  } catch (error) {
    console.error("Error logging forecast:", error);
    throw error;
  }
};

export const helpRequestSubmit = async (args , account)=>{
try {
    const hash = await writeContract(config, {
      address: AidAddress,
      abi: AidABI,
      functionName: 'helpRequestSubmit',
      args, 
      account,
    });

    const receipt = await waitForTransactionReceipt(config, { hash });
    return receipt;
  } catch (error) {
    console.error("Error submission :", error);
    throw error;
  }
}

export const donateCrypto = async (args , account,value)=>{
try {
    const hash = await writeContract(config, {
      address: AidAddress,
      abi: AidABI,
      functionName: 'donateCrypto',
      args, 
      account,
      value
    });

    const receipt = await waitForTransactionReceipt(config, { hash });
    return receipt;
  } catch (error) {
    console.error("Error submission :", error);
    throw error;
  }
}

export const donateFiat = async (args , account)=>{
try {
    const hash = await writeContract(config, {
      address: AidAddress,
      abi: AidABI,
      functionName: 'donateFiat',
      args, 
      account,
    });

    const receipt = await waitForTransactionReceipt(config, { hash });
    return receipt;
  } catch (error) {
    console.error("Error submission :", error);
    throw error;
  }
}

export const donateGoods = async (args , account)=>{
try {
    const hash = await writeContract(config, {
      address: AidAddress,
      abi: AidABI,
      functionName: 'donateGoods',
      args, 
      account,
    });

    const receipt = await waitForTransactionReceipt(config, { hash });
    return receipt;
  } catch (error) {
    console.error("Error submission :", error);
    throw error;
  }
}

export const donatorHelper = async (args , account)=>{
try {
    const hash = await writeContract(config, {
      address: AidAddress,
      abi: AidABI,
      functionName: 'donatorHelper',
      args,
      account,
    });

    const receipt = await waitForTransactionReceipt(config, { hash });
    return receipt;
  } catch (error) {
    console.error("Error submission :", error);
    throw error;
  }
}

export const changeHelp = async(args,account)=>{
  try {
    const hash = await writeContract(config,{
      address:AidAddress,
      abi:AidABI,
      functionName:'toggleHelp',
      args,
      account,
    })
    const receipt = await waitForTransactionReceipt(config,{hash});
    return receipt;
  } catch (error) {
    console.error("Error toggling help:", error);
    throw error;
  }
}

export const verifyDelivery = async (args , account)=>{
try {
    const hash = await writeContract(config, {
      address: AidAddress,
      abi: AidABI,
      functionName: 'verifyDelivery',
      args, 
      account,
    });

    const receipt = await waitForTransactionReceipt(config, { hash });
    return receipt;
  } catch (error) {
    console.error("Error submission :", error);
    throw error;
  }
}


export const getForecast = async () => {
  try {
    const data = await readContract(config, {
      address: ForeCastAddress,
      abi: ForeCastABI,
      functionName: 'getForecast',
      args: [], // if required
    });
    return data;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};

export const getAllHelpRequest = async () => {
  try {
    const data = await readContract(config, {
      address: AidAddress,
      abi: AidABI,
      functionName: 'getAllHelpRequest',
      args: [], // if required
    });
    return data;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};

export const getAllDonation = async () => {
  try {
    const data = await readContract(config, {
      address: AidAddress,
      abi: AidABI,
      functionName: 'getAllDonation',
      args: [], // if required
    });
    return data;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};
export const getPendingTask = async (wallet) => {
  try {
    const data = await readContract(config, {
      address: AidAddress,
      abi: AidABI,
      functionName: 'getPendingTask',
      args: [wallet], // if required
    });
    return data;
  } catch (error) {
    console.error("Error fetching pending task:", error);
    throw error;
  }
};
export const getProcessedRequests = async () => {
  try {
    const data = await readContract(config, {
      address: AidAddress,
      abi: AidABI,
      functionName: 'getProcessedRequests',
      args: [], // if required
    });
    return data;
  } catch (error) {
    console.error("Error fetching pending task:", error);
    throw error;
  }
};

export const getAllHelper = async()=>{
  try {
    const data = await readContract(config,{
      address:AidAddress,
      abi:AidABI,
      functionName:'allHelper',
      args:[],
    })
    return data;
  } catch (error) {
    console.log("Error fetching all helpers:", error);
    throw error;
  }
}
