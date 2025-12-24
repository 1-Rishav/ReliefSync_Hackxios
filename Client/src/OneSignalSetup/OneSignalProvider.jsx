import OneSignal from "react-onesignal";

export async function setupOneSignal() {
  const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
  
  await OneSignal.init({
    appId,
        allowLocalhostAsSecureOrigin: true,
    serviceWorkerPath: "OneSignalSDKWorker.js",
    serviceWorkerParam: { scope: "/" }
  });
}

// onesignalAuth.js

export async function linkOneSignalUser({ userId, role }) {
  if (!userId) {
  return;
}
  try {
    await OneSignal.login(String(userId)); // sets external_id
    await OneSignal.User.addTags({
      role, // e.g. role: "Citizen"
    });
  } catch (err) {
    console.error("Error linking OneSignal user", err);
  }
}

export async function logoutOneSignalUser() {
    await OneSignal.logout();
    console.log("OneSignal user logged out");
}
