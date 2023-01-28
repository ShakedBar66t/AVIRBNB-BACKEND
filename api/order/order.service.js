const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
    // console.log('inside order service query')

    try {
        const collection = await dbService.getCollection('order')
        var orders = await collection.find({}).toArray()
        // console.log(orders, 'from query at order service')
        return orders
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

// function sortCriteria(filterBy) {
//     if (filterBy.sort === 'createdAt') {
//         return { 'createdAt': 1 }
//     }
//     if (filterBy.sort === 'highPrice') {
//         return { 'price': -1 }
//     }
//     if (filterBy.sort === 'lowPrice') {
//         return { 'price': 1 }
//     }
//     return

// }

// async function query(filterBy = { name: '' }) {
//     try {
//         const criteria = {
//             name: { $regex: filterBy.name, $options: 'i' }
//         }
//         const collection = await dbService.getCollection('order')
//         var orders = await collection.find(criteria).toArray()
//         return orders
//     } catch (err) {
// logger.error('cannot find orders', err)
//         throw err
//     }
// }

// function _buildCriteria(filterBy) {
//     let criteria = {}
//     if (filterBy.name) {
//         criteria.name = { $regex: filterBy.name, $options: 'i' }
//     }
//     if (filterBy.maxPrice) {
//         criteria.price = { $lte: +filterBy.maxPrice }
//     }
//     if (filterBy?.labels?.length) {
//         criteria.labels = { $all: filterBy.labels.split(',') }
//     }
//     console.log(criteria)
//     return criteria
// }

// async function query(filterBy = { name: '' }) {
//     console.log('filterBy from query', filterBy)

//     try {
//         const criteria = _buildCriteria(filterBy)
//         console.log(criteria, 'the criteria')
//         const collection = await dbService.getCollection('order')
//         var orders = await collection.find(criteria).sort(sortCriteria(filterBy)).toArray()
//         return orders
//     } catch (err) {
// logger.error('cannot find orders from query', err)
//         throw err
//     }
// }

async function getById(orderId) {
    try {
        console.log(orderId, ' Order SERVICE')
        const collection = await dbService.getCollection('order')
        const order = collection.findOne({ _id: ObjectId(orderId) })
        console.log(order)
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        console.log(orderId, ' from backend')
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ _id: ObjectId(orderId) })
        return orderId
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function add(order) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.insertOne(order)
        return order
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

async function update(order) {
    try {
        const orderToSave = {
            name: order.name,
            price: order.price
        }
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: ObjectId(order._id) }, { $set: orderToSave })
        return order
    } catch (err) {
        logger.error(`cannot update order ${order._id}`, err)
        throw err
    }
}

async function addOrderMsg(orderId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: ObjectId(orderId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add order msg ${orderId}`, err)
        throw err
    }
}

async function removeOrderMsg(orderId, msgId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: orderId }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add order msg ${orderId}`, err)
        throw err
    }
}


module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addOrderMsg,
    removeOrderMsg
}
