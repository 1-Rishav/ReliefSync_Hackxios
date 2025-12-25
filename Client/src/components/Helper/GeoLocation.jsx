const Geolocation = () => {
  try {
    return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        resolve({ lat, lng }); // ✅ Proper return
      },
    )
     }
     )
     } catch (error) {
    console.log("Location access denied or unavailable")
  }
};

export default Geolocation;