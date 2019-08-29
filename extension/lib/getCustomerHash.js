module.exports = async (context, { customer }) => {
  if (!(customer && typeof customer === 'object')) {
    return { customerHash: null }
  }

  const { hash = '' } = customer

  return { customerHash: hash }
}
