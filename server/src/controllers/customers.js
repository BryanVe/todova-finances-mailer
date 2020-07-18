const Customer = require("../models/Customer")
const { downloadResource, getTimeInFormat } = require("../functions/utils")

const fields = [
  {
    label: "Index",
    value: "index",
  },
  {
    label: "Customer ID",
    value: "customerID",
  },
  {
    label: "Register Date",
    value: "registerDate",
  },
  {
    label: "Customer Name",
    value: "customerName",
  },
  {
    label: "RUT",
    value: "rut",
  },
  {
    label: "Email",
    value: "email",
  },
  {
    label: "Phone",
    value: "phone",
  },
  {
    label: "Platform",
    value: "platform",
  },
  {
    label: "Birthday",
    value: "birthday",
  },
  {
    label: "Customer Type",
    value: "customerType",
  },
  {
    label: "Business Type",
    value: "businessType",
  },
  {
    label: "Contact Person",
    value: "contactPerson",
  },
  {
    label: "Address",
    value: "address",
  },
]

module.exports = {
  download: async (req, res) => {
    const dateConstraint = req.dateConstraint

    const customers = await Customer.find(
      { ...dateConstraint },
      { _id: 1, details: 1, businessType: 1, contactPerson: 1, address: 1 }
    )

    const data = customers.map(
      ({ _id, details, businessType, contactPerson, address }, index) => ({
        index: index + 1,
        customerID: _id,
        registerDate: getTimeInFormat(details.createdTime, "DD-MM-YYYY"),
        customerName: `${details.firstName} ${details.lastName}`,
        rut: details.rut,
        email: details.email,
        phone: details.phone,
        platform: details.deviceType,
        birthday: getTimeInFormat(details.birthDate, "DD-MM-YYYY"),
        customerType: businessType === "" ? "customer" : "enterprise",
        businessType,
        contactPerson,
        address,
      })
    )

    return downloadResource(res, "customers.csv", fields, data)
  },
}
