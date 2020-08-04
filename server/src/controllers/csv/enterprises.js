const Enterprise = require("../../models/Enterprise")
const { downloadResource, getTimeInFormat } = require("../../functions/utils")

const fields = [
  {
    label: "Index",
    value: "index",
  },
  {
    label: "Enterprise ID",
    value: "enterpriseID",
  },
  {
    label: "Register Date",
    value: "registerDate",
  },
  {
    label: "Company Name",
    value: "companyName",
  },
  {
    label: "RUT",
    value: "rut",
  },
  {
    label: "Giro",
    value: "giro",
  },
  {
    label: "Address",
    value: "address",
  },
  {
    label: "Contact Name",
    value: "contactName",
  },
  {
    label: "Contact Number",
    value: "contactNumber",
  },
  {
    label: "Contact Email",
    value: "contactEmail",
  },
]

module.exports = {
  download: async (req, res) => {
    const dateConstraint = req.dateConstraint
    const enterprises = await Enterprise.find(
      { ...dateConstraint },
      {
        _id: 1,
        createdTime: 1,
        company: 1,
        userManagement: 1,
      }
    )

    const data = enterprises.map(
      ({ _id, createdTime, company, userManagement }, index) => ({
        index: index + 1,
        enterpriseID: _id,
        registerDate: getTimeInFormat(createdTime, "DD-MM-YYYY"),
        companyName: company.name,
        rut: company.rut,
        giro: company.giro,
        address: company.addressInfo.direction,
        contactName: `${userManagement[0].firstName} ${userManagement[0].lastName}`,
        contactNumber: userManagement[0].phone,
        contactEmail: userManagement[0].email,
      })
    )

    return downloadResource(res, "enterprises.csv", fields, data)
  },
}
