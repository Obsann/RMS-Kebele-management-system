// generate ID card renewal and addressing new ID card requests
const db = require('../db');

const generateIdCardRenewal = async (userId, idCardDetails) => {
  try {
    const renewalRequest = {
      userId,
      idCardDetails,
    requestType: 'renewal',
        status: 'pending',
        createdAt: new Date(),
    };
    const result = await db.collection('idCardRequests').insertOne(renewalRequest);
    return result.ops[0];
  } catch (error) {
    throw new Error('Error generating ID card renewal request: ' + error.message);
  }
};

const generateNewIdCardRequest = async (userId, idCardDetails) => {
    try {