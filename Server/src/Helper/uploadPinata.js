const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const uploadToPinata = async (filePath) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  try {
    const res = await axios.post(url, formData, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_API_SECRET,
      },
    });

    const IpfsHash = res.data.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
  } catch (err) {
    console.error('Upload to Pinata failed:', err.message);
    throw err;
  }
};

const deleteFromPinata = async (ipfsHash) => {
  const url = `https://api.pinata.cloud/pinning/unpin/${ipfsHash}`;

  try {
    await axios.delete(url, {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_API_SECRET,
      },
    });
    console.log(`Successfully unpinned: ${ipfsHash}`);
  } catch (err) {
    console.error('Unpin failed:', err.response?.data || err.message);
  }
};

module.exports = {uploadToPinata , deleteFromPinata};