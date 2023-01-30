const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId


async function query(filterBy = { name: '' }) {
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
    if (filterBy.type && filterBy.type !== `'`) {
        criteria.type = { $eq: filterBy.type }
    }
    if (filterBy.location !== 'flexible' && filterBy.location !== `I'm flexible`) {
        criteria.$or = [
            { "loc.state": { $regex: filterBy.location, $options: 'i' } },
            { "loc.country": { $regex: filterBy.location, $options: 'i' } },
            { "loc.city": { $regex: filterBy.location, $options: 'i' } }
        ]
    }
    return criteria
}

async function getById(stayId) {
    try {
        // console.log(stayId, ' STAY SERVICE')
        const collection = await dbService.getCollection('stay')
        const stay = collection.findOne({ _id: ObjectId(stayId) })
        // console.log(stay)
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function remove(stayId) {
    try {
        // console.log(stayId, ' from backend')
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ _id: ObjectId(stayId) })
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
    // console.log(stay._id, 'from stay.service')
    try {
        const stayToSave = { ...stay, _id: ObjectId(stay._id) }
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ _id: ObjectId(stay._id) }, { $set: stayToSave })
        return stay
    } catch (err) {
        logger.error(`cannot update stay ${stay._id}`, err)
        throw err
    }
}
// const collection = await dbService.getCollection('stay')
// addRatingToReviews(collection)
// function addRatingToReviews(collection) {
//     collection.find({}).forEach(function (stay) {
//         stay.reviews.forEach(function (review) {
//             review.rating = (Math.random() * (5 - 3.8) + 3.8).toFixed(1);
//         });
//         collection.save(stay);
//     });
// }



// async function update(toy) {
//     try {
//         const toyToSave = {
//             vendor: toy.vendor,
//             price: toy.price
//         }
//         const collection = await dbService.getCollection('toy')
//         await collection.updateOne({ _id: ObjectId(toy._id) }, { $set: toyToSave })
//         return toy
//     } catch (err) {
//         logger.error(`cannot update toy ${toyId}`, err)
//         throw err
//     }
// }

async function addLiketoStay(stayId, user) {
    try {
        // msg.id = utilService.makeId()
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ _id: ObjectId(stayId) }, { $push: { likedByUsers: user } })
        return msg
    } catch (err) {
        logger.error(`cannot add stay like ${stayId}`, err)
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
    removeStayMsg,
    addLiketoStay,
}
