const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId


async function query(filterBy = { name: '' }) {
    // console.log(filterBy)
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('stay')
        var stays = await collection.find(criteria).toArray()
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    if (!Object.values(filterBy).some(val => val !== undefined)) {
        return {}
    }
    let criteria = {}
    if (filterBy.minPrice && !isNaN(filterBy.minPrice)) {
        criteria.price = {
            $gte: +filterBy.minPrice
        }
    }
    if (filterBy.maxPrice && !isNaN(filterBy.maxPrice)) {
        if (criteria.price) {
            criteria.price.$lte = +filterBy.maxPrice
        } else {
            criteria.price = { $lte: +filterBy.maxPrice }
        }
    }
    if (filterBy.location !== 'flexible' && filterBy.location !== `I'm flexible`) {
        criteria.$or = [
            { "loc.country": { $regex: filterBy.location, $options: 'i' } },
            { "loc.state": { $regex: filterBy.location, $options: 'i' } },
            { "loc.city": { $regex: filterBy.location, $options: 'i' } }
        ]
    }

    // if (filterBy.total && !isNaN(filterBy.total) && filterBy.total > 0) {
    //     criteria.capacity = { $lte: +filterBy.total }
    // }

    if (filterBy.type && filterBy.type !== `'`) {
        criteria.type = { $eq: filterBy.type }
    }

    // console.log('the crit', criteria)
    return criteria
}

async function getById(stayId) {
    try {
        // console.log(stayId, ' STAY SERVICE')
        const collection = await dbService.getCollection('stay')
        const stay = collection.findOne({ _id: stayId })
        console.log(stay)
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function remove(stayId) {
    try {
        console.log(stayId, ' from backend')
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ _id: stayId })
        return stayId
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}

async function add(stay) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stay)
        return stay
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}

async function update(stay) {
    try {
        const stayToSave = {
            name: stay.name,
            price: stay.price
        }
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ _id: ObjectId(stay._id) }, { $set: stayToSave })
        return stay
    } catch (err) {
        logger.error(`cannot update stay ${stay._id}`, err)
        throw err
    }
}

async function addStayMsg(stayId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ _id: ObjectId(stayId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add stay msg ${stayId}`, err)
        throw err
    }
}

async function removeStayMsg(stayId, msgId) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ _id: ObjectId(stayId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add stay msg ${stayId}`, err)
        throw err
    }
}


module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addStayMsg,
    removeStayMsg
}
