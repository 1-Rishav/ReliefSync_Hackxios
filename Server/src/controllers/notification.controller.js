const catchAsync = require('../utils/catchAsync');
const axios = require('axios')

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;
const ONESIGNAL_URL = process.env.ONESIGNAL_URL;

exports.notifySegment = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const body = {
      app_id: ONESIGNAL_APP_ID,
      target_channel: "push",
      include_external_user_ids: [String(userId)],
      headings: { en: "Welcome to ReliefSync" },
      contents: { en: "Stay updated with real-time disaster alerts" },
      url: process.env.FRONTEND_URL,
      data: { source: "server-demo" },
    };

    const response = await axios.post(ONESIGNAL_URL, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${ONESIGNAL_API_KEY}`,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

function truncateText(text, max) {
  return text.length > max ? text.substring(0, max) + "..." : text;
}

exports.agenticEmergency = async ({ userId, dangerLevel = '', name = '', reason = '' }) => {
  // Convert to array + string
  const id = Array.isArray(userId)
    ? userId.map(id => String(id))
    : [String(userId)];

  const body = {
    app_id: ONESIGNAL_APP_ID,
    target_channel: "push",
    include_aliases: {
      external_id: id,
    },
    headings: { "en": "🚨 ReliefSync Urgent Help " },
    contents: {
      "en": `• Name: ${name.charAt(0).toUpperCase() + name.slice(1)}\n` +
        `• Danger: ${dangerLevel}\n` +
        `• Reason: ${reason}\n`
    },
  };

  const response = await axios.post("https://api.onesignal.com/notifications", body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${ONESIGNAL_API_KEY}`,
    },
  });

  const result = response.data;
  console.log("Push to roles response:", result);
  return result;
}

const sendPushToUser = async ({ userId = [], title = '', message = '', allocatedBy = '', }) => {
  const body = {
    app_id: ONESIGNAL_APP_ID,
    target_channel: "push",
    include_aliases: {
      external_id: userId,
    },
    headings: { "en": `🚨 ${title} ` },
    contents: {
      "en": `• ${message.charAt(0).toUpperCase() + message.slice(1)}\n` +
        `• Allocated By: ${allocatedBy}\n`
    },
  }

  const response = await axios.post(ONESIGNAL_URL, body, {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Key ${ONESIGNAL_API_KEY}`,
    },
  });
  console.log("Push to user response:", response.data);
  return response.data;
}

exports.sendNotification = catchAsync(async (req, res, next) => {
  try {
    const { userId, title, message, allocatedBy = '' } = req.body;

    const result = await sendPushToUser({
      userId: [userId],
      title: title || "ReliefSync Notification",
      message: message || "You have a new notification from ReliefSync.",
      allocatedBy
    });

    console.log("Notification sent:", result);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

const buildMessage = async (pushType, data) => {
  const {
    disasterType = '',
    riskLevel = '',
    requestType = '',
    description= '',
    survivor = '',
    count = 1,
    severity = '',
    duration = '',
    paidAmount = '',
    name = '',
    upiId = '',
  } = data;

  switch (pushType) {

    case "REQUESTER":
      const shortDescription = truncateText(description, 25);
      return {
        title: "🚨 ReliefSync Alert",
        message:
          `• Disaster: ${disasterType.toUpperCase()} (Risk: ${riskLevel})\n` +
          `• Request: ${requestType.toUpperCase()}\n` +
          `• ${survivor.charAt(0).toUpperCase() + survivor.slice(1)}: ${count} People\n` +
          `• Situation: ${shortDescription}`
      };

    case "REPORTER":
      return {
        title: "🚨 ReliefSync Alert",
        message:
          `• Disaster: ${disasterType.toUpperCase()} (Risk: ${riskLevel})\n` +
          `• Severity: ${severity}\n` +
          `• Ongoing for: ${duration} days`
      };

    case "SOS":
      return {
        title: "🚨 ReliefSync Emergency 🚨",
        message: `• Request: ${disasterType.toUpperCase()}`
      };

    case "Payment_Success":
      return {
        title: "💰 ReliefSync Donation Successful",
        message: `• Amount: ₹ ${paidAmount}\n` +
          `• Transfer To: ${name}\n` +
          `• Transfer UPI: ${upiId}`
      };

    default:
      return {
        title: "ReliefSync Notification",
        message: "You have a new update."
      };
  }
}

exports.pushToRoles = async ({
  roles = [],
  pushType = "",
  data = {},
  excludeUserId = null
}) => {

  const filters = [];
  roles.forEach((role, idx) => {
    if (idx > 0) filters.push({ operator: "OR" });
    filters.push({
      field: "tag",
      key: "role",
      relation: "=",
      value: role
    });
  });

  const {title , message} = await buildMessage(pushType, data);

  const body = {
    app_id: ONESIGNAL_APP_ID,
    target_channel: "push",
    filters,
    headings: { en: title },
    contents: { en: message },
    exclude_external_user_ids: [String(excludeUserId)]
  };

const response = await axios.post(ONESIGNAL_URL, body, {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Key ${ONESIGNAL_API_KEY}`,
    },
  });
  console.log("Push to roles response:", response.data);
  return response.data;
};

