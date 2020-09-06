const template_name = process.env.MANDRILL_TEMPLATE_NAME
const from_email = process.env.MANDRILL_SENDER_EMAIL
const from_name = process.env.MANDRILL_SENDER_NAME

module.exports = (to, attachments = [], template_content = []) => ({
  template_name,
  template_content,
  message: {
    subject: "Reporte de Envíos",
    from_email,
    from_name,
    to,
    headers: {
      "Reply-To": from_email,
    },
    important: true,
    attachments,
  },
})
