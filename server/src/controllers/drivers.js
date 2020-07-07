const Driver = require("../models/Driver")
const { downloadResource, getTimeInFormat } = require("../functions/utils")

// const stringOfFieldsFiltered =
//   "_id details.createdTime details.firstName details.lastName details.rut details.email details.phone details.profileImage bankDetails.bankName bankDetails.accountType bankDetails.accountNumber bankDetails.receiverName bankDetails.receiverRut subscribedDeliveries.walk "

const fields = [
  {
    label: "Index",
    value: "index",
  },
  {
    label: "Driver ID",
    value: "driverID",
  },
  {
    label: "Register Date",
    value: "registerDate",
  },
  {
    label: "Driver Name",
    value: "driverName",
  },
  {
    label: "Phone",
    value: "phone",
  },
  {
    label: "Delivery Type",
    value: "deliveryType",
  },
  {
    label: "Email",
    value: "email",
  },
  {
    label: "RUT",
    value: "rut",
  },
  {
    label: "Bank Name",
    value: "bankName",
  },
  {
    label: "Bank Account Type",
    value: "bankAccountType",
  },
  {
    label: "Bank Account Number",
    value: "bankAccountNumber",
  },
  {
    label: "Receiver Name",
    value: "receiverName",
  },
  {
    label: "Receiver RUT",
    value: "receiverRut",
  },
  {
    label: "Walk",
    value: "walkStatus",
  },
  {
    label: "Bicycle",
    value: "bicycleStatus",
  },
  {
    label: "Motorcycle",
    value: "motorcycleStatus",
  },
  {
    label: "Car",
    value: "carStatus",
  },
  {
    label: "RUT Image",
    value: "rutImage",
  },
  {
    label: "Criminal Record",
    value: "criminalRecord",
  },
  {
    label: "Driver License",
    value: "driverLicense",
  },
  {
    label: "Motorcycle Pass",
    value: "motorcyclePass",
  },
  {
    label: "Car Pass",
    value: "carPass",
  },
  {
    label: "Profile",
    value: "profile",
  },
]

const getActiveDeliveryType = (subscribedDeliveries) => {
  for (let deliveryType of Object.keys(subscribedDeliveries))
    if (subscribedDeliveries[deliveryType].isActiveOnDeliveryType)
      return deliveryType
  return ""
}

const getBankName = (bankDetails) => {
  if (bankDetails.bankName !== "No informado") return bankDetails.bankName
  return ""
}

const getBankAccountType = (bankDetails) => {
  if (bankDetails.accountType !== "No informado") return bankDetails.accountType
  return ""
}

const getSubscribedDeliveryStatus = (subscribedDeliveries, deliveryType) => {
  if (subscribedDeliveries[deliveryType])
    return subscribedDeliveries[deliveryType].driverStatusDictionaryCode
  return ""
}

const getVehicleCirculationPass = (driver, vehicleInfo) => {
  if (!!driver[vehicleInfo] && !!driver[vehicleInfo].circulationPermit) {
    return driver[vehicleInfo].circulationPermit
  }
  return ""
}

const controller = {}

controller.download = async (req, res) => {
  const dateConstraint = req.dateConstraint
  const drivers = await Driver.find(
    { ...dateConstraint },
    {
      _id: 1,
      details: 1,
      subscribedDeliveries: 1,
      bankDetails: 1,
      documentImage: 1,
    }
  )

  const data = drivers.map((driver, index) => ({
    index: index + 1,
    driverID: driver._id,
    registerDate: getTimeInFormat(driver.details.createdTime, "DD-MM-YYYY"),
    driverName: `${driver.details.firstName} ${driver.details.lastName}`,
    phone: driver.details.phone,
    deliveryType: getActiveDeliveryType(driver.subscribedDeliveries),
    email: driver.details.email,
    rut: driver.details.rut,
    bankName: getBankName(driver.bankDetails),
    bankAccountType: getBankAccountType(driver.bankDetails),
    bankAccountNumber: driver.bankDetails.accountNumber,
    receiverName: driver.bankDetails.receiverName,
    receiverRut: driver.bankDetails.receiverRut,
    walkStatus: getSubscribedDeliveryStatus(
      driver.subscribedDeliveries,
      "walk"
    ),
    bicycleStatus: getSubscribedDeliveryStatus(
      driver.subscribedDeliveries,
      "bicycle"
    ),
    motorcycleStatus: getSubscribedDeliveryStatus(
      driver.subscribedDeliveries,
      "motorcycle"
    ),
    carStatus: getSubscribedDeliveryStatus(driver.subscribedDeliveries, "car"),
    rutImage: driver.documentImage.rutImage,
    criminalRecord: driver.documentImage.criminalRecord,
    driverLicense: driver.documentImage.driverLicense,
    motorcyclePass: getVehicleCirculationPass(driver, "motoInfo"),
    carPass: getVehicleCirculationPass(driver, "carInfo"),
    profile: driver.details.profileImage,
  }))

  return downloadResource(res, "drivers.csv", fields, data)
}

module.exports = controller
