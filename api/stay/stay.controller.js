const stayService = require('./stay.service.js')

const logger = require('../../services/logger.service')

async function getStays(req, res) {

  // console.log('in GETSTAYS', req.query)
  try {
    logger.debug('Getting stays')
    const filterBy = {
      location: req.query.location,
      maxPrice: req.query.maxPrice,
      minPrice: req.query.minPrice,
      amenities: req.query.amenities,
      // total: req.query.total,
      type: req.query.type
    }

    // console.log(filterBy)
    if (+filterBy.maxPrice === 0) filterBy.maxPrice = Infinity
    // const stays = await stayService.query(filterBy)
    const stays = await stayService.query(filterBy)
    // console.log(stays)
    res.json(stays)
  } catch (err) {
    logger.error('Failed to get stays', err)
    res.status(500).send({ err: 'Failed to get stays' })
  }
}

async function getStayById(req, res) {
  console.log('in GETbyid')

  try {
    const stayId = req.params.id
    // console.log(stayId)
    const stay = await stayService.getById(stayId)
    // console.log(stay)
    res.json(stay)
  } catch (err) {
    logger.error('Failed to get stay', err)
    res.status(500).send({ err: 'Failed to get stay' })
  }
}

async function addStay(req, res) {
  const { loggedinUser } = req

  try {
    const stay = req.body
    // stay.owner = loggedinUser
    const addedStay = await stayService.add(stay)
    res.json(addedStay)
  } catch (err) {
    logger.error('Failed to add stay', err)
    res.status(500).send({ err: 'Failed to add stay' })
  }
}


async function updateStay(req, res) {
  // console.log('inside controller', req.body)
  try {
    const stay = req.body
    // console.log(stay, ' from update stay')
    const updatedStay = await stayService.update(stay)
    res.json(updatedStay)
  } catch (err) {
    logger.error('Failed to update stay', err)
    res.status(500).send({ err: 'Failed to update stay' })

  }
}

async function removeStay(req, res) {
  try {
    const stayId = req.params.id
    const removedId = await stayService.remove(stayId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove stay', err)
    res.status(500).send({ err: 'Failed to remove stay' })
  }
}

// async function addStayLike(req, res) {
//   const { loggedinUser } = req
//   try {
//     const stayId = req.params.id
//     const user = loggedinUser


//     // const user = {

//     //   // ...req.body
//     //   // name: req.body.name,
//     //   // by: loggedinUser
//     // }
//     const savedMsg = await stayService.addStayMsg(stayId, user)
//     res.json(savedMsg)
//   } catch (err) {
//     logger.error('Failed to update stay', err)
//     res.status(500).send({ err: 'Failed to update stay' })

//   }
// }

async function addStayMsg(req, res) {
  const { loggedinUser } = req
  try {
    const stayId = req.params.id
    const msg = {
      name: req.body.name,
      by: loggedinUser
    }
    const savedMsg = await stayService.addStayMsg(stayId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update stay', err)
    res.status(500).send({ err: 'Failed to update stay' })

  }
}

async function removeStayMsg(req, res) {
  const { loggedinUser } = req
  try {
    const stayId = req.params.id
    const { msgId } = req.params

    const removedId = await stayService.removeStayMsg(stayId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove stay msg', err)
    res.status(500).send({ err: 'Failed to remove stay msg' })

  }
}

module.exports = {
  getStays,
  getStayById,
  addStay,
  updateStay,
  removeStay,
  addStayMsg,
  removeStayMsg
}
